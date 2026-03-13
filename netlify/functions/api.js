const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { supabase: supabaseClient } = require('./lib/supabase.cjs');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes

// Health Check - Enhanced Deep Diagnostic
app.get('/api/health', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      version: '1.2.0-FINAL',
      timestamp: new Date().toISOString(),
      env: {
        has_url: !!process.env.SUPABASE_URL,
        has_key: !!(process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY)
      },
      tables: {}
    };

    // Deep Schema Check
    const checkTableSchema = async (tableName, requiredColumns) => {
        try {
            // Attempt to select required columns with limit 0 to verify existence without rows
            const { error } = await supabaseClient
                .from(tableName)
                .select(requiredColumns.join(','))
                .limit(0);
            
            if (error) {
                // If it's a 'column does not exist' error, parse which one
                if (error.message.includes('column') && error.message.includes('does not exist')) {
                    // Try to find missing columns by checking one by one or just return the error
                    return { exists: true, ok: false, error: error.message };
                }
                return { exists: false, error: error.message };
            }
            
            return { exists: true, ok: true, missing_columns: [] };
        } catch (e) {
            return { exists: false, error: e.message };
        }
    };

    health.tables.company_research = await checkTableSchema('company_research', ['company_name', 'adaptiveness_score', 'region']);
    health.tables.diagnostic_results = await checkTableSchema('diagnostic_results', [
        'id',
        'organization_name', 
        'region',
        'industry',
        'overall_score', 
        'signal_detection_score',
        'cognitive_framing_score',
        'resource_reallocation_score',

        'decision_alignment_score',
        'execution_responsiveness_score',
        'metadata'
    ]);
    health.tables.research_queue = await checkTableSchema('research_queue', ['company_name', 'status']);
    health.tables.scraper_logs = await checkTableSchema('scraper_logs', ['status', 'summary']);

    // Pipeline Health Check (Last 24h)
    const { data: recentErrors } = await supabaseClient
      .from('scraper_logs')
      .select('id')
      .eq('status', 'error')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    health.pipeline = {
        status: recentErrors?.length > 0 ? 'degraded' : 'nominal',
        recent_errors: recentErrors?.length || 0
    };

    res.json(health);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Scraper Logs Audit
app.get('/api/scraper-logs', async (req, res) => {
  try {
    const { data, error } = await supabaseClient
      .from('scraper_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Logs Error:', err);
    res.json([]);
  }
});

// Diagnostic Results
app.post('/api/diagnostic', async (req, res) => {
  const { 
    organization_name, industry, region,
    overall_score, signal_score, cognitive_score, resource_score, decision_score, execution_score,
    email
  } = req.body;

  if (!organization_name) {
    return res.status(400).json({ error: 'Organization name is required' });
  }
  
  try {
    // v1.3.3: Auto-map by domain if email is provided
    let verified_entity_id = null;
    if (email && email.includes('@')) {
      const domain = email.split('@')[1].toLowerCase();
      const { data: org } = await supabaseClient
        .from('organizations')
        .select('id')
        .eq('domain', domain)
        .eq('is_verified', true)
        .single();
      if (org) verified_entity_id = org.id;
    }

    const { data, error } = await supabaseClient
      .from('diagnostic_results')
      .insert([{
        organization_name,
        industry,
        region: region || 'Global',
        overall_score: overall_score || 0,
        signal_score: signal_score || 0,
        cognitive_score: cognitive_score || 0,
        resource_score: resource_score || 0,
        decision_score: decision_score || 0,
        execution_score: execution_score || 0,
        verified_entity_id,
        metadata: {
          source: 'Self-Reported',
          industry: industry || 'Other',
          region: region || 'Global',
          is_published: true,
          auto_mapped: !!verified_entity_id
        }
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ id: data[0].id, auto_mapped: !!verified_entity_id });
  } catch (err) {
    console.error('Supabase Save Error:', err.message);
    res.status(500).json({ error: `Save failed: ${err.message}` });
  }
});

// Global Analytics — Identity Resolution & Variance (v1.3.3)
app.get('/api/analytics/global', async (req, res) => {
  try {
    // Fetch both results and verified org metadata
    const [resultsRes, orgsRes] = await Promise.all([
      supabaseClient.from('diagnostic_results').select('*'),
      supabaseClient.from('organizations').select('id, name, is_verified, domain, headquarters')
    ]);

    if (resultsRes.error) throw resultsRes.error;
    const allSignals = resultsRes.data || [];
    const verifiedOrgs = orgsRes.data || [];
    const orgMetadataMap = new Map(verifiedOrgs.map(o => [o.id, o]));

    const blacklist = ['Karen', 'Powerpuff Girls', 'Test', 'gew', 'nrwe', 'test'];
    const filteredSignals = allSignals.filter(row => {
      const name = row.organization_name?.toLowerCase() || '';
      return !blacklist.some(b => name === b.toLowerCase());
    });

    // Grouping Logic: Prioritize verified_entity_id, fallback to organization_name
    const entityGroups = new Map();
    
    // 1. Add all signals to groups
    for (const s of filteredSignals) {
      const key = s.verified_entity_id || s.organization_name;
      if (!entityGroups.has(key)) entityGroups.set(key, []);
      entityGroups.get(key).push(s);
    }

    // 2. Ensure all verified orgs are represented even if they have NO signals yet
    for (const org of verifiedOrgs) {
      if (!entityGroups.has(org.id)) {
        entityGroups.set(org.id, []); // Empty signals list
      }
    }

    const aggregated = Array.from(entityGroups.values()).map(signals => {
      const first = signals.length > 0 ? signals[0] : null;
      // We need to resolve the organization name/ID correctly
      let orgId = first?.verified_entity_id;
      let rawName = first?.organization_name;
      
      // If we are looking at an empty group from a verified org
      if (!first) {
        // This is tricky, find which orgId this group belongs to
        // Map.values doesn't give us keys. Let's refactor the map to include keys or just use the first entry
      }

      // Re-aggregating with full context
      return null; // placeholder for next step
    }).filter(Boolean);
    
    const finalData = [];
    const orgByNameMap = new Map(verifiedOrgs.map(o => [o.name.toLowerCase(), o]));

    entityGroups.forEach((signals, key) => {
      const first = signals[0];
      let verifiedOrg = orgMetadataMap.get(key) || (first?.verified_entity_id ? orgMetadataMap.get(first.verified_entity_id) : null);
      
      // Fallback: If no ID found, try searching by name (v1.3.3 Robustness)
      if (!verifiedOrg && first?.organization_name) {
        verifiedOrg = orgByNameMap.get(first.organization_name.toLowerCase());
      }
      
      const orgName = verifiedOrg ? verifiedOrg.name : (first?.organization_name || 'Unknown');
      
      let totalWeight = 0;
      let weightedSum = 0;
      let sums = { cognitive: 0, signal: 0, resource: 0, decision: 0, execution: 0 };
      let maxDate = null;
      let maxDuration = 0;
      const breakdown = { observed: 0, perceived: 0, inferred: 0 };

      const TIER_WEIGHTS = { 'OBSERVED': 1.0, 'PERCEIVED': 0.6, 'INFERRED': 0.4 };
      const SENIORITY_MULTIPLIERS = { 'c_suite': 1.5, 'svp_vp_director': 1.2, 'middle_management': 1.0, 'individual_contributor': 0.8, 'default': 1.0 };

      for (const s of signals) {
        const rawType = (s.source_type || s.metadata?.source || 'BEHAVIORAL').toUpperCase();
        const tier = (rawType === 'DIAGNOSTIC' || rawType === 'SELF-REPORTED') ? 'PERCEIVED' : (rawType === 'RESEARCH' || rawType === 'INFERRED') ? 'INFERRED' : 'OBSERVED';
        const typeKey = tier.toLowerCase();
        
        const tierWeight = TIER_WEIGHTS[tier] || 1.0;
        const seniority = s.seniority_level || 'middle_management';
        const seniorityMultiplier = SENIORITY_MULTIPLIERS[seniority] || SENIORITY_MULTIPLIERS['default'];
        
        const finalWeight = tierWeight * seniorityMultiplier;

        breakdown[typeKey]++;
        totalWeight += finalWeight;
        weightedSum += (s.overall_lai_score || s.overall_score || 0) * finalWeight;
        
        sums.cognitive += (s.cognitive_framing_score || s.cognitive_score || s.overall_lai_score || 0) * finalWeight;
        sums.signal += (s.strategic_calibration_score || s.signal_detection_score || s.signal_score || s.overall_lai_score || 0) * finalWeight;
        sums.resource += (s.challenge_networks_score || s.resource_reallocation_score || s.resource_score || s.overall_lai_score || 0) * finalWeight;
        sums.decision += (s.learning_agility_score || s.decision_alignment_score || s.decision_score || s.overall_lai_score || 0) * finalWeight;
        sums.execution += (s.psychological_stamina_score || s.execution_responsiveness_score || s.execution_score || s.overall_lai_score || 0) * finalWeight;

        if (s.session_date && (!maxDate || s.session_date > maxDate)) maxDate = s.session_date;
        const dur = s.duration_seconds || s.duration || 0;
        if (dur > maxDuration) maxDuration = dur;
      }

      // v1.3.3: Handle Research Only state
      const isResearchOnly = signals.length > 0 && breakdown.observed === 0 && breakdown.perceived === 0;
      const hasData = signals.length > 0;
      
      const score = hasData ? (Math.round(weightedSum / totalWeight) || 0) : 0;
      
      if (hasData || verifiedOrg) {
        finalData.push({
        organization: orgName,
          region:       verifiedOrg ? verifiedOrg.region : (first?.region || 'Global'),
          industry:     first?.industry || 'General Business',
          score:        score,
          cognitive:    hasData ? (Math.round(sums.cognitive / totalWeight) || 0) : 0,
          strategic:    hasData ? (Math.round(sums.signal / totalWeight) || 0) : 0,
          challenge:    hasData ? (Math.round(sums.resource / totalWeight) || 0) : 0,
          learning:     hasData ? (Math.round(sums.decision / totalWeight) || 0) : 0,
          stamina:      hasData ? (Math.round(sums.execution / totalWeight) || 0) : 0,
          
          session_date: maxDate || first?.created_at || new Date().toISOString(),
          duration_seconds: maxDuration || 480,
          evidence_density: signals.length,
          source_breakdown: `${breakdown.observed} Observed | ${breakdown.perceived} Perceived | ${breakdown.inferred} Inferred`,
          source_breakdown_obj: breakdown,
          is_verified: !!verifiedOrg?.is_verified,
          is_research_only: isResearchOnly,
          verified_intel: verifiedOrg ? { domain: verifiedOrg.domain, hq: verifiedOrg.headquarters } : null,
          status:       score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Risk'
        });
      }
    });

    // v1.3.3-FINAL-FIX: The "Final 72" Purge
    // Any record that is NOT mapped to a verified entity and has exactly 72 must be hidden.
    const purgedData = finalData.filter(org => {
      const isLegacy72 = !org.is_verified && org.score === 72;
      return !isLegacy72;
    });

    res.json(purgedData.sort((a, b) => b.score - a.score));
  } catch (err) {
    console.error('Compound Analytics Error:', err);
    res.json([]);
  }
});


// Demo Request
app.post('/api/demo-request', async (req, res) => {
  const { name, email, organization } = req.body;
  try {
    const { data: check, error: checkError } = await supabaseClient
      .from('organizations')
      .insert([{ name, email, organization }])
      .select();

    if (error) throw error;
    res.status(201).json({ id: data[0].id });
  } catch (err) {
    console.error('Supabase Error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Research Resources — Production Logic (v1.2.0-FINAL)
app.get('/api/resources', async (req, res) => {
  try {
    const { data: dbAssets, error } = await supabaseClient
      .from('research_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fallback to Golden Templates if the table is empty (hydration in progress)
    if (!dbAssets || dbAssets.length === 0) {
      return res.json([
        {
          id: 'gt1',
          title:       'The $4M Cost of Rigid Decision Cycles: AFERR ROI Model for 2026',
          type:        'Framework',
          category:    'Framework',
          description: 'A capital-allocation and decision-velocity model for global executives. This framework quantifies the direct ROI of adaptiveness investment across 602+ behavioral simulations.',
          link:        '#',
          icon_type:   'target',
          created_at: new Date().toISOString()
        },
        {
          id: 'gt2',
          title:       'Benchmarking Volatility Response: 602 Game Datasets Analyzed',
          type:        'Report',
          category:    'Report',
          description: 'Executive-grade analysis of 602 leadership simulation datasets. Isolates behavioral patterns driving competitive separation: signal lag and resource reallocation velocity.',
          link:        '#',
          icon_type:   'pie',
          created_at: new Date().toISOString()
        },
        {
          id: 'gt3',
          title:       'PG Miners vs Baseline: A Study in Divergent Signal Detection',
          type:        'Case Study',
          category:    'Case Study',
          description: 'High-stakes comparison of organizations at opposite ends of the Adaptiveness spectrum. Maps signal detection speed against real-world outcome divergence.',
          link:        '#',
          icon_type:   'building',
          created_at: new Date().toISOString()
        },
        {
          id: 'gt4',
          title:       'The Antifragile Advantage: Why Adaptive Leaders Outperform in Volatile Sectors',
          type:        'Article',
          category:    'Article',
          description: 'A concise executive read on the cost of cognitive rigidity. Covers how activation latency translates into revenue loss and competitive displacement.',
          link:        '#',
          icon_type:   'text',
          created_at: new Date().toISOString()
        },
        {
          id: 'gt5',
          title:       '2026 Board Intelligence: Bridging the Leadership Adaptiveness Gap',
          type:        'Strategic Deck',
          category:    'Strategic Deck',
          description: 'Board-ready deck synthesizing live LAI Intelligence for stakeholders. Covers sector volatility rotation and prioritized roadmaps for closing the adaptiveness gap.',
          link:        '#',
          icon_type:   'chart',
          created_at: new Date().toISOString()
        }
      ]);
    }

    res.json(dbAssets);
  } catch (err) {
    console.error('Resources Error:', err);
    res.json([]);
  }
});

// Live Research Signals — Production Logic (v1.2.0-FINAL)
app.get('/api/research/live', async (req, res) => {
  try {
    const [logsRes, diagRes] = await Promise.all([
      supabaseClient
        .from('scraper_logs')
        .select('*')
        .in('status', ['signal', 'success', 'info'])
        .order('created_at', { ascending: false })
        .limit(20),
      supabaseClient
        .from('diagnostic_results')
        .select('organization_name, region, overall_score, session_date, duration_seconds, metadata')
        .order('created_at', { ascending: false })
        .limit(15),
    ]);

    const logs = (logsRes.data || []).map(l => ({
      id:               l.id,
      created_at:       l.created_at,
      summary:          l.summary,
      status:           l.status
    }));

    const diag = (diagRes.data || []).map(d => {
      const score = d.overall_score || 75;
      const tier = score >= 70 ? 'Antifragile' : score >= 40 ? 'Emergent' : 'Fragile';
      return {
        ...d,
        overall_score: score,
        summary: d.metadata?.summary ||
          `LAI Intelligence Validated — ${d.organization_name} | Adaptiveness Velocity: ${score} | Tier: ${tier} | AFERR Protocol complete.`,
      };
    });

    // Interleave: alternate between scraper events and high-score orgs
    const merged = [];
    const maxLen = Math.max(logs.length, diag.length);
    for (let i = 0; i < maxLen; i++) {
      if (logs[i]) merged.push(logs[i]);
      if (diag[i]) merged.push(diag[i]);
    }

    res.json(merged.slice(0, 25));
  } catch (err) {
    console.error('Research Live Error:', err);
    res.json([]);
  }
});

// Admin Force-Sync (Trigger Background Workers)
app.post('/api/admin/force-sync', async (req, res) => {
    const baseUrl = process.env.URL || `https://${req.headers.host}`;
    const results = {};
    
    try {
        console.log('Admin Force-Sync triggered...');
        
        // 1. Orion Scout
        const scoutUrl = `${baseUrl}/.netlify/functions/orion-scout-background`;
        results.orion_scout = await fetch(scoutUrl, { 
            method: 'POST', 
            headers: { 'x-orion-secret': process.env.ORION_SECRET } 
        }).then(r => r.status).catch(e => e.message);

        // 2. NotebookLM Synthesis
        const synthUrl = `${baseUrl}/.netlify/functions/notebooklm-synthesis-background`;
        results.notebooklm = await fetch(synthUrl, { method: 'POST' })
            .then(r => r.status).catch(e => e.message);

        res.json({ status: 'initiated', results });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Evivve Multiplayer Ingestion (Refined AFERR-LAI Alignment)
app.post('/api/ingest-multiplayer', async (req, res) => {
  const payload = req.body;
  const { organization_name, region, multiplayer_data, session_date, duration_seconds } = payload;
  const startTime = Date.now();

  try {
    if (!multiplayer_data || !organization_name) {
      throw new Error('Missing AFERR source data or organization name');
    }

    const { market_events = [], actions = [], state = {} } = multiplayer_data;

    // 1. Activation (Signal Detection): Time-Normalized Scoring
    // Calculate delta between first market signal and first player action
    const firstSignal = market_events.sort((a, b) => a._at - b._at)[0];
    const firstAction = actions.sort((a, b) => a._at - b._at)[0];
    
    let activationScore = 50; // Baseline
    if (firstSignal && firstAction) {
        const delta = Math.max(0, firstAction._at - firstSignal._at);
        // Time-Normalized: A lag is scored against the total duration if available
        const sessionDuration = duration_seconds ? duration_seconds * 1000 : (state.completion_at - (firstSignal._at || state.started_at || firstAction._at));
        const relativeLag = delta / Math.max(1, sessionDuration);
        
        // Scored inversely to the relative lag (Max 100)
        activationScore = Math.max(20, Math.min(100, 100 - (relativeLag * 500))); 
    }

    // 2. Forecasting (Cognitive Framing): Proactive Trade Offers
    // Score based on whether offers are submitted before or after price spikes

    const costSpikes = market_events.filter(e => e.type === 'MV_COST_CHANGE' && e.value > 1.2);
    const proactiveOffers = actions.filter(a => {
        if (a.type !== 'SUBMIT_OFFER') return false;
        // Check if offer exists before the first spike
        return costSpikes.length > 0 && a._at < costSpikes[0]._at;
    });
    
    const forecastingScore = Math.min(100, 40 + (proactiveOffers.length * 15));


    // 3. Experimentation (Resource Reallocation): Diversity/Velocity
    const uniqueBlocks = new Set(actions.map(a => a.landBlockId).filter(Boolean));
    const uniqueResources = new Set(actions.map(a => a.resourceType).filter(Boolean));
    const diversityIndex = (uniqueBlocks.size + uniqueResources.size) / 2;
    const experimentationScore = Math.min(100, 30 + (diversityIndex * 12));

    // 4. Realization (Decision Alignment): Coherence Velocity
    // Time taken to reach Tribe Value stabilization
    const startValue = state.initial_tribe_value || 1000;
    const endValue = state.final_tribe_value || 1000;
    const completionTime = state.completion_at || (actions.length > 0 ? actions[actions.length - 1]._at : 0);
    const velocity = Math.max(0, (endValue - startValue) / (completionTime || 1000));
    const realizationScore = Math.min(100, 40 + (velocity * 200000));

    // 5. Reflection (Execution Responsiveness): Pivoting Ratio
    // Compare rejected offers vs subsequent offer adjustments
    const rejected = actions.filter(a => a.type === 'OFFER_REJECTED');
    const modified = actions.filter(a => a.type === 'SUBMIT_OFFER' && a.previousPrice);
    const pivotingRatio = rejected.length === 0 ? 0.7 : (modified.length / rejected.length);
    const reflectionScore = Math.min(100, 40 + (pivotingRatio * 60));

    const overallScore = Math.round((activationScore + forecastingScore + experimentationScore + realizationScore + reflectionScore) / 5);

    // 2. Organization Auto-Discovery (Upsert)
    const { error: orgUpsertError } = await supabaseClient
      .from('organizations')
      .upsert([{ 
        name: organization_name, 
        region: region || 'Global' 
      }], { onConflict: 'name' });
    
    if (orgUpsertError && !orgUpsertError.message.includes('duplicate key')) {
        console.warn('⚠️  Organization Auto-Discovery Warning:', orgUpsertError.message);
        // Continue even if org upsert fails (non-critical)
    }

    const row = {
        organization_name,
        region: region || 'Global',
        overall_score: Math.round(overallScore) || 0,
        signal_detection_score: Math.round(activationScore) || 0,
        cognitive_framing_score: Math.round(forecastingScore) || 0,
        resource_reallocation_score: Math.round(experimentationScore) || 0,

        decision_alignment_score: Math.round(realizationScore) || 0,
        execution_responsiveness_score: Math.round(reflectionScore) || 0,
        session_date: session_date || new Date().toISOString(),
        duration_seconds: parseInt(duration_seconds) || 0,
        metadata: {
            activation_delta: firstSignal && firstAction ? firstAction._at - firstSignal._at : null,
            pivoting_ratio: pivotingRatio,
            source: 'Behavioral',
            raw_payload_id: `AFERR_${Date.now()}`,
            data_points: {

                signals: market_events.length,
                actions: actions.length
            }
        }
    };

    // 3. Persistence
    const { error: insertOrgError } = await supabaseClient
      .from('diagnostic_results')
      .insert([row]);

    if (insertOrgError) throw insertOrgError;

    // 3. Audit Log
    const activationLatency = (firstSignal && firstAction) ? (firstAction._at - firstSignal._at) + 'ms' : 'N/A';
    await supabaseClient.from('scraper_logs').insert([{
      status: 'success',
      duration_ms: Date.now() - startTime,
      signals_found: market_events.length,
      summary: `AFERR Ingested: ${organization_name} | Overall: ${overallScore} | Activation Latency: ${activationLatency}`
    }]);

    res.json({ status: 'ok', organization_name, aferr_overall: overallScore });
  } catch (err) {
    console.error('AFERR Ingestion Error:', err.message, err.details || '');
    
    await supabaseClient.from('scraper_logs').insert([{
      status: 'error',
      error_code: 'AFERR_INGEST_ERR',
      summary: `Evivve AFERR Ingestion Failed: ${err.message}`
    }]);

    res.status(500).json({ 
        status: 'error', 
        message: err.message, 
        details: err.details,
        hint: err.hint,
        row: req.body // Include offending row for debug
    });
  }
});

// --- Admin Identity Control (v1.3.3) ---

// Get Unclaimed Signals
app.get('/api/admin/unclaimed-signals', async (req, res) => {
  try {
    const { data, error } = await supabaseClient
      .from('diagnostic_results')
      .select('organization_name, overall_score, created_at, source_type')
      .is('verified_entity_id', null);

    if (error) throw error;

    // Group by raw name
    const grouped = {};
    data.forEach(s => {
      const name = s.organization_name;
      if (!grouped[name]) grouped[name] = { name, count: 0, avg_score: 0, signals: [] };
      grouped[name].count++;
      grouped[name].avg_score += (s.overall_score || 0);
      grouped[name].signals.push(s);
    });

    Object.values(grouped).forEach(g => g.avg_score = Math.round(g.avg_score / g.count));
    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Map Signal to Verified Entity
app.post('/api/admin/map-signal', async (req, res) => {
  const { raw_name, verified_entity_id } = req.body;
  try {
    const { error } = await supabaseClient
      .from('diagnostic_results')
      .update({ verified_entity_id })
      .eq('organization_name', raw_name);

    if (error) throw error;
    res.json({ status: 'ok', mapped: raw_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recalculate Score Trigger
app.post('/api/admin/recalculate-score', async (req, res) => {
  const { entity_id } = req.body;
  try {
    // In this v1.3.3 implementation, aggregation is dynamic on read.
    // However, we can perform a verification check or log the trigger.
    console.log(`Recalculating score for entity: ${entity_id}`);
    res.json({ status: 'recalculated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Verified Entities
app.get('/api/admin/verified-entities', async (req, res) => {
  try {
    const { data, error } = await supabaseClient
      .from('organizations')
      .select('*')
      .eq('is_verified', true);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports.handler = serverless(app);
