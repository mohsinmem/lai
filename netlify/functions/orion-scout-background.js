const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const supabase = require('./lib/supabase');

/**
 * Orion Scout - Automated Adaptiveness Scraper
 * Stage: LAI Background Intelligence
 */

const LAI_MATRIX = {
  signal_detection: {
    keywords: ['predict', 'outlook', 'trend', 'forecast', 'anticipate', 'early indicator', 'market shift'],
    weight: 1.2
  },
  emotional_framing: {
    keywords: ['curiosity', 'opportunity', 'challenge', 'optimism', 'uncertainty', 'resilience', 'pivot'],
    weight: 1.0
  },
  resource_reallocation: {
    keywords: ['restructure', 'investment', 'budget shift', 'layoff', 'hiring surge', 'acquisition', 'divestiture'],
    weight: 1.5
  },
  decision_alignment: {
    keywords: ['consensus', 'leadership team', 'strategic board', 'unanimous', 'vision alignment', 'reorg'],
    weight: 1.1
  },
  execution_responsiveness: {
    keywords: ['rapid', 'agile', 'deployment', 'operational change', 'speed to market', 'implementation', 'rollout'],
    weight: 1.3
  }
};

exports.handler = async (event) => {
  const startTime = Date.now();
  
  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {}

  // 0. Security & Trigger Check
  const isCron = event.headers['x-netlify-cron'] === 'true';
  const hasSecret = event.headers['x-orion-secret'] === process.env.ORION_SECRET || body.secret === process.env.ORION_SECRET;
  
  if (!isCron && !hasSecret) {
    console.error('Unauthorized access attempt to Orion Scout');
    return { statusCode: 401, body: 'Unauthorized' };
  }

  console.log('Orion Scout initiated...');

  let browser = null;
  try {
    // 1. Fetch "Stale" or "New" Companies
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Attempt 1: Get companies from research table that haven't been scanned recently
    let { data: companies, error: fetchError } = await supabase
      .from('company_research')
      .select('company_name, region')
      .lt('last_researched', thirtyDaysAgo)
      .limit(2);

    // Attempt 2: If nothing stale, get companies from latest diagnostics that aren't in research yet
    if (!companies || companies.length === 0) {
      console.log('No stale companies found. Checking latest diagnostics for new targets...');
      const { data: diagComps } = await supabase
        .from('diagnostic_results')
        .select('organization_name, region')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (diagComps) {
        // Map organization_name to company_name
        companies = diagComps.map(c => ({ company_name: c.organization_name, region: c.region }));
      }
    }

    if (fetchError) throw fetchError;
    if (!companies || companies.length === 0) {
      console.log('No companies found to scan. Seeding a default test target...');
      companies = [{ company_name: 'Microsoft', region: 'North America' }];
    }

    // 2. Launch Browser
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    const scanResults = [];

    for (const company of companies) {
      console.log(`Scanning signals for: ${company.company_name}`);
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(company.company_name + ' leadership strategy change')}&tbm=nws`;
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      // Extract headlines and snippets
      const signals = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('div.So033e').forEach(el => {
          results.push(el.innerText.toLowerCase());
        });
        return results.join(' ');
      });

      // 3. LAI Intelligence Logic (The Matrix)
      const scores = {
        signal_detection: 0,
        emotional_framing: 0,
        resource_reallocation: 0,
        decision_alignment: 0,
        execution_responsiveness: 0
      };

      let totalSignalsFound = 0;

      Object.keys(LAI_MATRIX).forEach(dimension => {
        LAI_MATRIX[dimension].keywords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const count = (signals.match(regex) || []).length;
          if (count > 0) {
            scores[dimension] += count * LAI_MATRIX[dimension].weight;
            totalSignalsFound += count;
          }
        });
      });

      // Calculate localized adaptiveness score (Base 50 + weighted signals)
      const adaptivenessScore = Math.min(100, 50 + (totalSignalsFound * 2));

      // 4. Persistence
      const { error: upsertError } = await supabase
        .from('company_research')
        .upsert({
          company_name: company.company_name,
          region: company.region,
          adaptiveness_score: adaptivenessScore,
          research_notes: `Orion Scout found ${totalSignalsFound} strategic signals in latest news.`,
          last_researched: new Date().toISOString()
        }, { onConflict: 'company_name' });

      if (upsertError) throw upsertError;

      scanResults.push({
        company: company.company_name,
        signals: totalSignalsFound,
        score: adaptivenessScore
      });
    }

    // 5. Audit Logging
    const duration = Date.now() - startTime;
    await supabase.from('scraper_logs').insert([{
      status: 'success',
      duration_ms: duration,
      signals_found: scanResults.reduce((acc, curr) => acc + curr.signals, 0),
      summary: JSON.stringify(scanResults)
    }]);

    console.log(`Orion Scout completed in ${duration}ms.`);

  } catch (err) {
    console.error('Orion Scout Failure:', err);
    // Audit Fail
    await supabase.from('scraper_logs').insert([{
      status: 'error',
      summary: err.message
    }]);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
};
