const { supabase } = require('./lib/supabase.cjs');

/**
 * NotebookLM Intelligence Engine v2 — 5-Asset Research Factory
 * Synthesizes AFERR behavioral intelligence into high-fidelity research content.
 *
 * Asset Types:
 *   1. Framework    — Sector-specific adaptiveness models
 *   2. Report       — Research Briefs from 600+ game datasets
 *   3. Case Study   — High vs Low performer tribe comparisons
 *   4. Article      — Short-form thought leadership
 *   5. Strategic Deck — Presentation-ready executive insights
 */

const SECTORS = ['Semiconductors', 'Logistics', 'FinTech', 'Global Baseline', 'Defense', 'Healthcare'];

// ── Asset Template Factory ────────────────────────────────────────────────────
function generateAssets(sector, stats) {
  const { avgScore, topTribe, bottomTribe, totalSessions } = stats;

  const evolutionaryState =
    avgScore >= 70 ? 'Antifragile' :
    avgScore >= 40 ? 'Emergent'    : 'Fragile';

  return [
    {
      title:       `${sector} Adaptiveness Framework 2026`,
      type:        'Framework',
      category:    'Framework',
      description: `Theoretical model for bridging the ${sector} Adaptiveness Gap. Derived from ${totalSessions}+ high-fidelity leadership simulations. Sector state: ${evolutionaryState}.`,
      link:        '#',
      icon_type:   'target'
    },
    {
      title:       `${sector} Research Brief: AFERR Behavioral Signals`,
      type:        'Report',
      category:    'Report',
      description: `Narrative deep-dive into ${totalSessions}+ ${sector} game datasets. Average AFERR Velocity: ${avgScore}. Key cognitive patterns identified across regional cohorts.`,
      link:        '#',
      icon_type:   'pie'
    },
    {
      title:       `Case Study: Cognitive Divergence in ${sector}`,
      type:        'Case Study',
      category:    'Case Study',
      description: `Tribe-level comparison. Top performer: ${topTribe} (${evolutionaryState}). Bottom benchmark: ${bottomTribe}. Divergence mapped across all 5 AFERR dimensions.`,
      link:        '#',
      icon_type:   'building'
    },
    {
      title:       `Closing the ${sector} Adaptiveness Gap`,
      type:        'Article',
      category:    'Article',
      description: `Short-form thought leadership for senior leaders. Examines activation latency, cognitive framing, and execution velocity within the ${sector} sector.`,
      link:        '#',
      icon_type:   'text'
    },
    {
      title:       `${sector} Executive Strategy Deck 2026`,
      type:        'Strategic Deck',
      category:    'Framework',
      description: `Board-ready presentation integrating live AFERR Intelligence. Covers sector rotation signals, volatility mapping, and evolution pathways for ${sector} leaders.`,
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
    const bottomTribe   = sortedOrgs[sortedOrgs.length - 1]?.organization_name || 'Baseline Tribe';

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

    // 7. Audit log
    const duration = Date.now() - startTime;
    await supabase.from('scraper_logs').insert([{
      status:      'success',
      duration_ms: duration,
      summary:     `NotebookLM v2: ${published}/5 assets published for "${sector}" | Avg AFERR: ${avgScore} | Sessions: ${scores.length}`
    }]);

    console.log(`✅ NotebookLM Synthesis complete: ${published} assets for ${sector} in ${duration}ms.`);
    return { statusCode: 200, body: JSON.stringify({ sector, published, avgScore }) };

  } catch (err) {
    console.error('NotebookLM Synthesis Failure:', err);
    await supabase.from('scraper_logs').insert([{ status: 'error', summary: `NotebookLM v2 Error: ${err.message}` }]);
    return { statusCode: 500, body: err.message };
  }
};
