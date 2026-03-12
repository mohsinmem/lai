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
    // 1. Fetch targets from the organizations table
    let { data: targets, error: fetchError } = await supabase
      .from('organizations')
      .select('name, region')
      .order('last_scanned', { ascending: true, nullsFirst: true })
      .limit(5);

    if (fetchError) throw fetchError;
    if (!targets || targets.length === 0) {
      console.log('No organizations found in tracking table.');
      return { statusCode: 200, body: 'No targets to scan' };
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

    for (const company of targets) {
      const companyName = company.name;
      console.log(`Scanning signals for: ${companyName}`);
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(companyName + ' leadership strategy adaptiveness news')}&tbm=nws`;
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const signals = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('div.So033e, div.nS4uS, div.mCBkyc').forEach(el => {
          results.push(el.innerText.toLowerCase());
        });
        return results.join(' ');
      });

      // 3. AFERR Intelligence Scoring
      const scores = {
        activation: 40,      // Baseline
        forecasting: 40,
        experimentation: 40,
        realization: 40,
        reflection: 40
      };

      let hits = 0;
      Object.keys(LAI_MATRIX).forEach(dim => {
        LAI_MATRIX[dim].keywords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const count = (signals.match(regex) || []).length;
          if (count > 0) {
            scores[dim] = Math.min(100, scores[dim] + (count * LAI_MATRIX[dim].weight * 5.5));
            hits += count;
          }
        });
      });

      const overallScore = Math.round((scores.activation + scores.forecasting + scores.experimentation + scores.realization + scores.reflection) / 5);

      // 4. Persistence - Upsert to diagnostic_results
      const { error: insertError } = await supabase
        .from('diagnostic_results')
        .insert([{
          organization_name: companyName,
          region: company.region || 'Global',
          industry: 'Automated Research',
          overall_score: overallScore,
          signal_detection_score: parseFloat(scores.activation.toFixed(2)),
          emotional_framing_score: parseFloat(scores.forecasting.toFixed(2)),
          resource_reallocation_score: parseFloat(scores.experimentation.toFixed(2)),
          decision_alignment_score: parseFloat(scores.realization.toFixed(2)),
          execution_responsiveness_score: parseFloat(scores.reflection.toFixed(2)),
          metadata: {
              source: 'orion-scout',
              signals_found: hits,
              timestamp: new Date().toISOString()
          }
        }]);

      if (insertError) throw insertError;

      // Update last scanned timestamp
      await supabase.from('organizations').update({ last_scanned: new Date().toISOString() }).eq('name', companyName);

      scanResults.push({ company: companyName, signals: hits, score: overallScore });
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
