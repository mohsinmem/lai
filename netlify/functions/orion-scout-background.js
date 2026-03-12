const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const supabase = require('./lib/supabase.cjs');

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

    const AFERR_WORDS = {
        proactive: ['launch', 'pioneer', 'predict', 'anticipate', 'create', 'foresee', 'vision', 'blueprint', 'expand', 'invest'],
        reactive: ['responding', 'recovery', 'restoring', 'compensating', 'mitigate', 'downsize', 'defend', 'legacy', 'crisis'],
        experimentation: ['pilot', 'test', 'beta', 'sandbox', 'trial', 'prototype', 'exploratory', 'variant', 'innovation'],
        reflection: ['pivot', 'lessons', 'feedback', 'review', 'adjustment', 'correction', 'post-mortem', 'calibration']
    };

    for (const company of targets) {
      const companyName = company.name;
      console.log(`Analyzing AFERR alignment for: ${companyName}`);
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(companyName + ' leadership strategy news')}&tbm=nws`;
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const newsItems = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div.So033e, div.nS4uS')).map(el => ({
            text: el.innerText.toLowerCase(),
            date: el.querySelector('span')?.innerText || 'recently'
        }));
      });

      const signals = newsItems.map(i => i.text).join(' ');

      // 1. Signal Detection (Activation): Latency Scoring
      // Score higher if "fresh" news contains strategic keywords
      let activationScore = 40; 
      const freshNews = newsItems.filter(i => i.date.includes('hour') || i.date.includes('minute') || i.date.includes('day ago'));
      activationScore = Math.min(100, 40 + (freshNews.length * 10));

      // 2. Cognitive Framing (Forecasting): Proactive vs Reactive
      let proCount = 0;
      let reCount = 0;
      AFERR_WORDS.proactive.forEach(w => proCount += (signals.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length);
      AFERR_WORDS.reactive.forEach(w => reCount += (signals.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length);
      
      const totalFraming = proCount + reCount;
      const forecastingScore = totalFraming === 0 ? 50 : Math.min(100, (proCount / (proCount + reCount + 1)) * 120);

      // 3. Resource Reallocation (Experimentation): Keyword Diversity
      let expCount = 0;
      AFERR_WORDS.experimentation.forEach(w => expCount += (signals.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length);
      const experimentationScore = Math.min(100, 40 + (expCount * 8));

      // 4. Decision Alignment (Realization): Signal Coherence
      // Logic: If signals are found across multiple categories, they are "aligned"
      const categoriesFound = [proCount > 0, reCount > 0, expCount > 0].filter(Boolean).length;
      const realizationScore = 40 + (categoriesFound * 20);

      // 5. Execution Responsiveness (Reflection): Pivoting Ratio
      let refCount = 0;
      AFERR_WORDS.reflection.forEach(w => refCount += (signals.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length);
      const reflectionScore = Math.min(100, 40 + (refCount * 12));

      const hits = proCount + reCount + expCount + refCount;
      const overallScore = Math.round((activationScore + forecastingScore + experimentationScore + realizationScore + reflectionScore) / 5);

      // 4. Persistence - Upsert to diagnostic_results
      const { error: insertError } = await supabase
        .from('diagnostic_results')
        .insert([{
          organization_name: companyName,
          region: company.region || 'Global',
          overall_score: overallScore,
          signal_detection_score: parseFloat(activationScore.toFixed(2)),
          emotional_framing_score: parseFloat(forecastingScore.toFixed(2)),
          resource_reallocation_score: parseFloat(experimentationScore.toFixed(2)),
          decision_alignment_score: parseFloat(realizationScore.toFixed(2)),
          execution_responsiveness_score: parseFloat(reflectionScore.toFixed(2)),
          metadata: {
              source: 'orion-scout-v2',
              proactive_ratio: proCount / (totalFraming || 1),
              pivoting_hits: refCount,
              timestamp: new Date().toISOString()
          }
        }]);

      if (insertError) throw insertError;

      // Update last scanned timestamp
      await supabase.from('organizations').update({ last_scanned: new Date().toISOString() }).eq('name', companyName);

      scanResults.push({ company: companyName, signals: hits, score: overallScore, framing: proCount > reCount ? 'proactive' : 'reactive' });
    }

    // 5. Audit Logging
    const duration = Date.now() - startTime;
    await supabase.from('scraper_logs').insert([{
      status: 'success',
      duration_ms: duration,
      signals_found: scanResults.reduce((acc, curr) => acc + curr.signals, 0),
      summary: scanResults.map(r => `AFERR Scanned: ${r.company} | Score: ${r.score} | Cognitive Framing: ${r.framing}`).join('; ') || 'No viable organizations found.'
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
