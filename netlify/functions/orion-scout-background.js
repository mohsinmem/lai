const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const { supabase } = require('./lib/supabase.cjs');

/**
 * Orion Scout v3 — Volatility-Hunting Intelligence Scraper
 * Anchored: Semiconductors, Logistics, FinTech
 * Auto-Rotates: 2 additional sectors based on global news volume
 */

const ANCHOR_SECTORS = ['Semiconductors', 'Logistics', 'FinTech'];

// Volatility Rotation: sectors we monitor for news-volume spikes
const VOLATILITY_POOL = [
  'Aerospace', 'Defense', 'Healthcare', 'Energy', 'Automotive',
  'Real Estate', 'Retail', 'Agriculture', 'Pharma', 'Cybersecurity',
  'AI & Machine Learning', 'Quantum Computing', 'Space Technology'
];

const AFERR_WORDS = {
  proactive:       ['launch', 'pioneer', 'predict', 'anticipate', 'create', 'foresee', 'vision', 'blueprint', 'expand', 'invest', 'innovate', 'disrupt'],
  reactive:        ['responding', 'recovery', 'restoring', 'compensating', 'mitigate', 'downsize', 'defend', 'legacy', 'crisis', 'shortfall', 'delay'],
  experimentation: ['pilot', 'test', 'beta', 'sandbox', 'trial', 'prototype', 'exploratory', 'variant', 'innovation', 'experiment'],
  reflection:      ['pivot', 'lessons', 'feedback', 'review', 'adjustment', 'correction', 'post-mortem', 'calibration', 'overhaul', 'rethink']
};

// ── Volatility Hunter ─────────────────────────────────────────────────────────
async function detectVolatileSectors(page) {
  // Sample 6 random sectors and count news article density as a proxy for "volume"
  const sample = VOLATILITY_POOL.sort(() => Math.random() - 0.5).slice(0, 6);
  const scores = [];

  for (const sector of sample) {
    try {
      const url = `https://www.google.com/search?q=${encodeURIComponent(sector + ' industry news disruption 2026')}&tbm=nws`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const count = await page.evaluate(() => document.querySelectorAll('div.So033e, div.nS4uS, article').length);
      scores.push({ sector, count });
    } catch {
      scores.push({ sector, count: 0 });
    }
  }

  // Return top 2 by article count
  return scores.sort((a, b) => b.count - a.count).slice(0, 2).map(s => s.sector);
}

// ── AFERR Score Calculator ────────────────────────────────────────────────────
function calculateAFERR(signals, newsItems) {
  const freshNews = newsItems.filter(i => i.date?.includes('hour') || i.date?.includes('min') || i.date?.includes('day'));
  const activationScore = Math.min(100, 40 + (freshNews.length * 10));

  let pro = 0, re = 0, exp = 0, ref = 0;
  AFERR_WORDS.proactive.forEach(w       => pro += (signals.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length);
  AFERR_WORDS.reactive.forEach(w        => re  += (signals.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length);
  AFERR_WORDS.experimentation.forEach(w => exp += (signals.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length);
  AFERR_WORDS.reflection.forEach(w      => ref += (signals.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length);

  const total = pro + re;
  const forecastingScore   = total === 0 ? 50 : Math.min(100, (pro / (total + 1)) * 120);
  const experimentScore    = Math.min(100, 40 + exp * 8);
  const categoriesFound    = [pro > 0, re > 0, exp > 0].filter(Boolean).length;
  const realizationScore   = 40 + categoriesFound * 20;
  const reflectionScore    = Math.min(100, 40 + ref * 12);
  const overallScore       = Math.round((activationScore + forecastingScore + experimentScore + realizationScore + reflectionScore) / 5);

  return { activationScore, forecastingScore, experimentScore, realizationScore, reflectionScore, overallScore, hits: pro + re + exp + ref, framing: pro > re ? 'proactive' : 'reactive' };
}

// ── Main Handler ──────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const startTime = Date.now();

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}

  const isCron     = event.headers?.['x-netlify-cron'] === 'true';
  const hasSecret  = event.headers?.['x-orion-secret'] === process.env.ORION_SECRET || body.secret === process.env.ORION_SECRET;
  if (!isCron && !hasSecret) return { statusCode: 401, body: 'Unauthorized' };

  console.log('🔭 Orion Scout v3 initiated (Volatility-Hunting mode)…');

  let browser = null;
  try {
    // 1. Fetch anchor org targets
    let { data: targets } = await supabase
      .from('organizations')
      .select('name, region, industry')
      .order('last_scanned', { ascending: true, nullsFirst: true })
      .limit(5);

    if (!targets?.length) {
      console.log('No anchor targets found — aborting.');
      return { statusCode: 200, body: 'No targets to scan' };
    }

    // 2. Launch headless browser
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    // 3. Detect volatile sectors (Volatility Hunting)
    console.log('📡 Detecting volatile sectors…');
    const volatileSectors = await detectVolatileSectors(page);
    console.log(`🔥 Volatile sectors detected: ${volatileSectors.join(', ')}`);

    const activeSectors = [...new Set([...ANCHOR_SECTORS, ...volatileSectors])];

    // Log volatile sectors to scraper_logs for the dashboard
    await supabase.from('scraper_logs').insert([{
      status: 'info',
      summary: `Orion Scout: Active sector rotation → ${activeSectors.join(' | ')}. Volatile: ${volatileSectors.join(', ')}`,
      duration_ms: Date.now() - startTime
    }]);

    // 4. Scan anchor orgs
    const scanResults = [];
    for (const company of targets) {
      console.log(`🔍 Scanning: ${company.name}`);
      const url = `https://www.google.com/search?q=${encodeURIComponent(company.name + ' leadership strategy news 2026')}&tbm=nws`;

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const newsItems = await page.evaluate(() =>
        Array.from(document.querySelectorAll('div.So033e, div.nS4uS')).map(el => ({
          text: el.innerText?.toLowerCase() || '',
          date: el.querySelector('span')?.innerText || ''
        }))
      );

      const signals = newsItems.map(i => i.text).join(' ');
      const aferr   = calculateAFERR(signals, newsItems);

      const { error } = await supabase.from('diagnostic_results').insert([{
        organization_name:              company.name,
        region:                         company.region || 'Global',
        overall_lai_score:              aferr.overallScore,
        signal_interpretation_score:        parseFloat(aferr.forecastingScore.toFixed(2)),
        cognitive_framing_score:    parseFloat(aferr.activationScore.toFixed(2)),
        resource_reallocation_score:       parseFloat(aferr.experimentScore.toFixed(2)),
        decision_alignment_score:         parseFloat(aferr.realizationScore.toFixed(2)),
        execution_responsiveness_score:  parseFloat(aferr.reflectionScore.toFixed(2)),
        metadata: {
          source:          'orion-scout-v3',
          sector_rotation: activeSectors,
          volatile:        volatileSectors,
          proactive_ratio: aferr.framing,
          timestamp:       new Date().toISOString()
        }
      }]);

      if (!error) {
        await supabase.from('organizations').update({ last_scanned: new Date().toISOString() }).eq('name', company.name);
      }

      scanResults.push({ company: company.name, score: aferr.overallScore, framing: aferr.framing, hits: aferr.hits });
    }

    // 5. Also scan one volatile-sector news page for signal extraction
    for (const sector of volatileSectors) {
      const url = `https://www.google.com/search?q=${encodeURIComponent(sector + ' leadership adaptiveness strategies 2026')}&tbm=nws`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const text = await page.evaluate(() => document.body?.innerText?.toLowerCase() || '');
      const aferr = calculateAFERR(text, []);

      await supabase.from('scraper_logs').insert([{
        status: 'signal',
        summary: `GLAM Signal | Sector: ${sector} | AFERR Velocity: ${aferr.overallScore} | Framing: ${aferr.framing}`,
        duration_ms: Date.now() - startTime
      }]);
    }

    // 6. Audit log
    const duration = Date.now() - startTime;
    await supabase.from('scraper_logs').insert([{
      status: 'success',
      duration_ms: duration,
      signals_found: scanResults.reduce((a, c) => a + c.hits, 0),
      summary: `Orion Scout v3 complete. Sectors: ${activeSectors.join(', ')}. Orgs: ${scanResults.map(r => `${r.company}(${r.score})`).join(', ')}`
    }]);

    return { statusCode: 200, body: JSON.stringify({ sectors: activeSectors, results: scanResults }) };

  } catch (err) {
    console.error('Orion Scout Failure:', err);
    await supabase.from('scraper_logs').insert([{ status: 'error', summary: `Orion Scout v3 Error: ${err.message}` }]);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
};

// Netlify 60-minute Cron Activation
exports.config = {
  schedule: "@hourly"
};
