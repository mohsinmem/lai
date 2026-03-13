const { supabase } = require('./lib/supabase.cjs');

/**
 * NotebookLM Intelligence Engine v2 — 5-Asset Research Factory
 * Synthesizes AFERR behavioral intelligence into high-fidelity research content.
 *
 * Asset Types:
 *   1. Framework    — Sector-specific adaptiveness models
 *   2. Report       — Research Briefs from 600+ game datasets
 *   3. Case Study   — High vs Low performer organization comparisons
 *   4. Article      — Short-form thought leadership
 *   5. Strategic Deck — Presentation-ready executive insights
 */

const SECTORS = ['Semiconductors', 'Logistics', 'FinTech', 'Global Baseline', 'Defense', 'Healthcare'];

// ── Asset Template Factory (Golden Templates v1.2.0-FINAL) ────────────────────
function generateAssets(sector, stats) {
  const { avgScore, topTribe, bottomTribe, totalSessions } = stats;

  const evolutionaryState =
    avgScore >= 70 ? 'Antifragile' :
    avgScore >= 40 ? 'Emergent'    : 'Fragile';

  return [
    {
      title:       `The $4M Cost of Rigid Decision Cycles: ${sector} ROI Model 2026`,
      type:        'Framework',
      category:    'Framework',
      description: `A capital-allocation and decision-velocity model for ${sector} executives. Quantifies the direct ROI of adaptiveness investment across ${totalSessions}+ behavioral simulations. Sector state: ${evolutionaryState}.`,
      link:        '#',
      icon_type:   'target'
    },
    {
      title:       `Benchmarking Volatility Response: ${totalSessions} ${sector} Game Datasets Analyzed`,
      type:        'Report',
      category:    'Report',
      description: `Executive-grade analysis of ${totalSessions} leadership simulation datasets in the ${sector} sector. Isolates behavioral patterns driving competitive separation: signal lag and resource reallocation velocity.`,
      link:        '#',
      icon_type:   'pie'
    },
    {
      title:       `${topTribe} vs ${bottomTribe}: A Study in Divergent Signal Detection`,
      type:        'Case Study',
      category:    'Case Study',
      description: `High-stakes comparison of ${sector} organizations at opposite ends of the Adaptiveness spectrum. Maps signal detection speed against real-world outcome divergence. Benchmark: ${avgScore} avg score.`,
      link:        '#',
      icon_type:   'building'
    },
    {
      title:       `The Antifragile Advantage: Why ${sector} Leaders Outperform in Volatile Sectors`,
      type:        'Article',
      category:    'Article',
      description: `A concise executive read on the cost of cognitive rigidity in ${sector}. Covers how activation latency and execution misalignment translate into revenue loss and competitive displacement.`,
      link:        '#',
      icon_type:   'text'
    },
    {
      title:       `2026 Board Intelligence: Bridging the ${sector} Leadership Adaptiveness Gap`,
      type:        'Strategic Deck',
      category:    'Strategic Deck',
      description: `Board-ready deck synthesizing live LAI Intelligence for ${sector} stakeholders. Covers sector volatility rotation and prioritized roadmaps for closing the adaptiveness gap.`,
      link:        '#',
      icon_type:   'chart'
    }
  ];
}

// ── Main Handler ──────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const startTime = Date.now();
  console.log('🤖 NotebookLM Intelligence Engine v2 initiated…');

  try {
    // 1. Pull latest AFERR intelligence
    const { data: scores } = await supabase
      .from('diagnostic_results')
      .select('organization_name, overall_score, region, metadata')
      .order('created_at', { ascending: false })
      .limit(200);

    const { data: scrapedSignals } = await supabase
      .from('scraper_logs')
      .select('summary, status, created_at')
      .in('status', ['signal', 'success'])
      .order('created_at', { ascending: false })
      .limit(30);

    if (!scores?.length) {
      console.log('No AFERR data found — skipping synthesis.');
      return { statusCode: 200, body: 'No data available for synthesis' };
    }

    // 2. Determine active sector from latest Orion Scout log
    const latestLog = scrapedSignals?.find(s => s.summary?.includes('Sector:'));
    const detectedSectors = SECTORS;

    if (latestLog?.summary) {
      const match = latestLog.summary.match(/→ ([^.]+)\./);
      if (match) {
        // Extract volatile sectors from the log and add them if not already present
        const mentioned = match[1].split(' | ').map(s => s.trim());
        mentioned.forEach(s => { if (!detectedSectors.includes(s)) detectedSectors.push(s); });
      }
    }

    // 3. Pick one sector per run (rotate through them)
    const hour = new Date().getUTCHours();
    const sectorIndex = Math.floor(hour / 4) % detectedSectors.length;
    const sector = detectedSectors[sectorIndex];

    console.log(`📚 Synthesizing assets for sector: ${sector}`);

    // 4. Compute stats for this synthesis cycle
    const sessionScores = scores.map(s => s.overall_score || 0);
    const avgScore      = Math.round(sessionScores.reduce((a, b) => a + b, 0) / (sessionScores.length || 1));
    const sortedOrgs    = [...scores].sort((a, b) => b.overall_score - a.overall_score);
    const topTribe      = sortedOrgs[0]?.organization_name || 'Unknown Leader';
    const bottomTribe   = sortedOrgs[sortedOrgs.length - 1]?.organization_name || 'Baseline Entity';

    const stats = { avgScore, topTribe, bottomTribe, totalSessions: scores.length };

    // 5. Generate all 5 asset types
    const assets = generateAssets(sector, stats);

    // 6. Upsert to research_resources (idempotent on title)
    let published = 0;
    for (const asset of assets) {
      const { error } = await supabase
        .from('research_resources')
        .upsert([asset], { onConflict: 'title' });
      if (!error) published++;
      else console.warn(`⚠️ Upsert warning for "${asset.title}": ${error.message}`);
    }

    // 7. NEW: Inject JSON Score Record into Global Index (Research Pipeline v1.3.0)
    // This allows research findings to manifest as uniquely weighted map markers.
    console.log(`📍 Mapping Research Benchmark for ${sector}...`);
    
    // Distill a primary benchmark for the sector
    await supabase.from('diagnostic_results').insert([{
      organization_name: `${sector} Research Benchmark`,
      industry: sector,
      region: 'Global',
      source_type: 'RESEARCH', // Maps to Tier 3: Inferred Intelligence
      overall_score: avgScore,
      signal_score: avgScore + 2,
      cognitive_score: avgScore + 5, 
      resource_score: avgScore + 1,
      decision_score: avgScore,
      execution_score: avgScore - 2,
      confidence_score: 0.85,
      metadata: {
        source: 'Research',
        tier: 'Inferred Intelligence',
        sector: sector,
        generated_at: new Date().toISOString(),
        is_published: true,
        evidence_density: totalSessions
      }
    }]);

    // Distill individual signals for top performers in the sector
    if (topTribe && topTribe !== 'Unknown Leader') {
      await supabase.from('diagnostic_results').insert([{
        organization_name: topTribe,
        industry: sector,
        region: 'Global',
        source_type: 'RESEARCH',
        signal_interpretation_score: Math.min(100, avgScore + 10), // Example value, adjust as needed
        cognitive_framing_score: Math.min(100, avgScore + 15),    // Example value, adjust as needed
        resource_reallocation_score: Math.min(100, avgScore + 5), // Example value, adjust as needed
        decision_alignment_score: Math.min(100, avgScore + 12),   // Example value, adjust as needed
        execution_responsiveness_score: Math.min(100, avgScore + 8), // Example value, adjust as needed
        confidence_score: 0.75,
        metadata: {
          source: 'Research',
          tier: 'Inferred Intelligence',
          type: 'Case Study Validation',
          sector: sector,
          generated_at: new Date().toISOString()
        }
      }]);
    }

    // 8. Audit log

    const duration = Date.now() - startTime;
    await supabase.from('scraper_logs').insert([{
      status:      'success',
      duration_ms: duration,
      summary:     `NotebookLM v2: ${published}/5 assets published for "${sector}" | Research Marker Injected | Avg AFERR: ${avgScore}`
    }]);


    console.log(`✅ NotebookLM Synthesis complete: ${published} assets for ${sector} in ${duration}ms.`);
    return { statusCode: 200, body: JSON.stringify({ sector, published, avgScore }) };

  } catch (err) {
    console.error('NotebookLM Synthesis Failure:', err);
    await supabase.from('scraper_logs').insert([{ status: 'error', summary: `NotebookLM v2 Error: ${err.message}` }]);
    return { statusCode: 500, body: err.message };
  }
};
