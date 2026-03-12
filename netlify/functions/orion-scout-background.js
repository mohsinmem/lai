const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const supabase = require('./lib/supabase');

/**
 * Orion Scout - Automated Adaptiveness Scraper
 * Stage: LAI Background Intelligence
 */

const LAI_MATRIX = {
  activation: {
    keywords: ['predict', 'outlook', 'trend', 'forecast', 'anticipate', 'early indicator', 'market shift', 'trigger', 'launch'],
    weight: 1.2
  },
  forecasting: {
    keywords: ['roadmap', 'projection', 'long-term', 'strategy planning', 'future', 'horizon', 'modeling'],
    weight: 1.0
  },
  experimentation: {
    keywords: ['pilot', 'prototype', 'test', 'beta', 'innovation lab', 'trial', 'sandbox', 'mvp'],
    weight: 1.5
  },
  realization: {
    keywords: ['revenue', 'value', 'outcome', 'success', 'roi', 'profit', 'attainment', 'deployment', 'scale'],
    weight: 1.1
  },
  reflection: {
    keywords: ['review', 'audit', 'feedback', 'lessons learned', 'pivot', 'correction', 'post-mortem', 'adjustment'],
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
    // 1. Fetch targets from diagnostic_results (unique organizations)
    let { data: companies, error: fetchError } = await supabase
      .from('diagnostic_results')
      .select('organization_name, region')
      .order('created_at', { ascending: false })
      .limit(5);

    if (fetchError) throw fetchError;
    if (!companies || companies.length === 0) {
      console.log('No organizations found in diagnostic_results. Seeding default test target...');
      companies = [{ organization_name: 'NVIDIA', region: 'North America' }];
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
      const companyName = company.organization_name;
      console.log(`Scanning signals for: ${companyName}`);
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(companyName + ' leadership strategy change')}&tbm=nws`;
      
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
        activation: 50,
        forecasting: 50,
        experimentation: 50,
        realization: 50,
        reflection: 50
      };

      let totalSignalsFound = 0;

      Object.keys(LAI_MATRIX).forEach(dimension => {
        LAI_MATRIX[dimension].keywords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const count = (signals.match(regex) || []).length;
          if (count > 0) {
            scores[dimension] = Math.min(100, scores[dimension] + (count * LAI_MATRIX[dimension].weight * 5));
            totalSignalsFound += count;
          }
        });
      });

      const overallScore = Math.round(
          (scores.activation + scores.forecasting + scores.experimentation + scores.realization + scores.reflection) / 5
      );

      // 4. Persistence - Update diagnostic_results
      // We look for the latest entry for this organization and update it, 
      // or we can treat this as an "Intelligence" type entry.
      // For simplicity, we update the existing diagnostic if present.
      const { error: upsertError } = await supabase
        .from('diagnostic_results')
        .insert([{
          organization_name: companyName,
          region: company.region,
          overall_score: overallScore,
          signal_score: Math.round(scores.activation),
          emotional_score: Math.round(scores.forecasting), // Mapping for existing columns
          resource_score: Math.round(scores.experimentation),
          decision_score: Math.round(scores.realization),
          execution_score: Math.round(scores.reflection),
          industry: 'Automated Insight'
        }]);

      if (upsertError) throw upsertError;

      scanResults.push({
        company: companyName,
        signals: totalSignalsFound,
        score: overallScore
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
