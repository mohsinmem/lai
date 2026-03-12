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
      version: '1.1.11',
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

    health.tables.diagnostic_results = await checkTableSchema('diagnostic_results', [
        'id',
        'organization_name', 
        'region',
        'overall_score', 
        'signal_detection_score',
        'emotional_framing_score',
        'resource_reallocation_score',
        'decision_alignment_score',
        'execution_responsiveness_score',
        'metadata'
    ]);
    health.tables.company_research = await checkTableSchema('company_research', ['company_name', 'adaptiveness_score', 'region']);
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
    overall_score, signal_score, emotional_score, resource_score, decision_score, execution_score 
  } = req.body;
  
  if (!organization_name) {
    return res.status(400).json({ error: 'Organization name is required' });
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('diagnostic_results')
      .insert([{
        organization_name,
        industry,
        region: region || 'Global',
        overall_score: overall_score || 0,
        signal_score: signal_score || 0,
        emotional_score: emotional_score || 0,
        resource_score: resource_score || 0,
        decision_score: decision_score || 0,
        execution_score: execution_score || 0
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ id: data[0].id });
  } catch (err) {
    console.error('Supabase Save Error:', err.message);
    res.status(500).json({ error: `Save failed: ${err.message}` });
  }
});

// Global Analytics (Unified Diagnostic + Research)
app.get('/api/analytics/global', async (req, res) => {
  try {
    // Graceful fetch - don't crash if one table is missing
    const results = await Promise.allSettled([
      supabaseClient.from('diagnostic_results').select('region, overall_score'),
      supabaseClient.from('company_research').select('region, adaptiveness_score')
    ]);

    const diagData = results[0].status === 'fulfilled' ? results[0].value.data : [];
    const researchData = results[1].status === 'fulfilled' ? results[1].value.data : [];

    // Aggregate by region
    const regions = {};
    
    const processEntry = (row, scoreKey) => {
      if (!row || !row.region) return;
      if (!regions[row.region]) {
        regions[row.region] = { region: row.region, count: 0, total_score: 0 };
      }
      const r = regions[row.region];
      r.count++;
      r.total_score += row[scoreKey] || 0;
    };

    if (Array.isArray(diagData)) diagData.forEach(row => processEntry(row, 'overall_score'));
    if (Array.isArray(researchData)) researchData.forEach(row => processEntry(row, 'adaptiveness_score'));

    const analytics = Object.values(regions).map(r => ({
      region: r.region,
      participants: r.count,
      avg_score: Math.round(r.total_score / r.count) || 0
    }));

    res.json(analytics);
  } catch (err) {
    console.error('Analytics Error:', err);
    res.json([]); // Fallback to empty instead of 500
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

// Live Research Signals
app.get('/api/research/live', async (req, res) => {
  try {
    const { data, error } = await supabaseClient
      .from('company_research')
      .select('*')
      .order('last_researched', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Supabase Error (Research Feed):', err);
    // Return empty array instead of 500 so UI doesn't break if table isn't seeded yet
    res.json([]);
  }
});

// Evivve Multiplayer Ingestion (Refined AFERR-LAI Alignment)
app.post('/api/ingest-multiplayer', async (req, res) => {
  const payload = req.body;
  const { organization_name, region, multiplayer_data } = payload;
  const startTime = Date.now();

  try {
    if (!multiplayer_data || !organization_name) {
      throw new Error('Missing AFERR source data or organization name');
    }

    const { market_events = [], actions = [], state = {} } = multiplayer_data;

    // 1. Activation (Signal Detection): Time Delta Scoring
    // Calculate delta between first market signal and first player action
    const firstSignal = market_events.sort((a, b) => a._at - b._at)[0];
    const firstAction = actions.sort((a, b) => a._at - b._at)[0];
    
    let activationScore = 50; // Baseline
    if (firstSignal && firstAction) {
        const delta = Math.max(0, firstAction._at - firstSignal._at);
        // Faster activation = higher score (Max 100, drops as delta increases)
        activationScore = Math.max(20, Math.min(100, 100 - (delta / 5000)));
    }

    // 2. Forecasting (Cognitive Framing): Proactive Trade Offers
    // Score based on whether offers are submitted before or after price spikes
    const costSpikes = market_events.filter(e => e.type === 'MV_COST_CHANGE' && e.value > 1.2);
    const proactiveOffers = actions.filter(a => {
        if (a.type !== 'SUBMIT_OFFER') return false;
        // Check if offer exists before the first spike
        return costSpikes.length > 0 && a._at < costSpikes[0]._at;
    });
    
    const forecastingScore = 40 + (proactiveOffers.length * 15);

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
    const velocity = (endValue - startValue) / (completionTime || 1000);
    const realizationScore = Math.min(100, 40 + (velocity * 200000));

    // 5. Reflection (Execution Responsiveness): Pivoting Ratio
    // Compare rejected offers vs subsequent offer adjustments
    const rejected = actions.filter(a => a.type === 'OFFER_REJECTED');
    const modified = actions.filter(a => a.type === 'SUBMIT_OFFER' && a.previousPrice);
    const pivotingRatio = rejected.length === 0 ? 0.7 : (modified.length / rejected.length);
    const reflectionScore = Math.min(100, 40 + (pivotingRatio * 60));

    const overallScore = Math.round((activationScore + forecastingScore + experimentationScore + realizationScore + reflectionScore) / 5);

    // 2. Persistence
    const { error: insertOrgError } = await supabaseClient
      .from('diagnostic_results')
      .insert([{
        organization_name,
        region: region || 'Global',
        overall_score: overallScore,
        signal_detection_score: parseFloat(activationScore.toFixed(2)),
        emotional_framing_score: parseFloat(forecastingScore.toFixed(2)),
        resource_reallocation_score: parseFloat(experimentationScore.toFixed(2)),
        decision_alignment_score: parseFloat(realizationScore.toFixed(2)),
        execution_responsiveness_score: parseFloat(reflectionScore.toFixed(2)),
        metadata: {
            activation_delta: firstSignal && firstAction ? firstAction._at - firstSignal._at : null,
            pivoting_ratio: pivotingRatio,
            raw_payload_id: `AFERR_${Date.now()}`,
            data_points: {
                signals: market_events.length,
                actions: actions.length
            }
        }
      }]);

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
    console.error('AFERR Ingestion Error:', err.message);
    
    await supabaseClient.from('scraper_logs').insert([{
      status: 'error',
      error_code: 'AFERR_INGEST_ERR',
      summary: `Evivve AFERR Ingestion Failed: ${err.message}`
    }]);

    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports.handler = serverless(app);
