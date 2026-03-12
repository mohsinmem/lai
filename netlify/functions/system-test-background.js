const supabase = require('./lib/supabase');

/**
 * Netlify Background Function: system-test-background
 * Runs a full end-to-end smoke test of the LAI Research Pipeline.
 */
exports.handler = async (event) => {
  console.log('🚀 Starting System Smoke Test...');
  const testCompany = `TEST_CORP_${Math.floor(Math.random() * 1000)}`;
  const startTime = Date.now();
  
  const results = {
    test_id: testCompany,
    steps: [],
    final_status: 'failed'
  };

  const logStep = (name, status, details = '') => {
    console.log(`[Step] ${name}: ${status} ${details}`);
    results.steps.push({ name, status, details, timestamp: new Date().toISOString() });
  };

  try {
    // 1. Verify Supabase Connectivity
    const { data: connTest, error: connError } = await supabase.from('company_research').select('id').limit(1);
    if (connError) throw new Error(`Supabase Connectivity Failed: ${connError.message}`);
    logStep('Supabase Connectivity', 'success');

    // 2. Seed Test Company into Queue
    const { error: seedError } = await supabase
      .from('research_queue')
      .insert([{ company_name: testCompany, region: 'TestRegion', status: 'pending' }]);
    
    if (seedError) throw new Error(`Seeding Failed: ${seedError.message}`);
    logStep('Seed Test Company', 'success', `Company: ${testCompany}`);

    // 3. Trigger Scheduler
    const baseUrl = process.env.URL || `https://${event.headers.host}` || 'https://lai.institute';
    const schedulerUrl = `${baseUrl.replace(/\/$/, '')}/.netlify/functions/research-scheduler`;
    
    console.log(`Triggering scheduler at: ${schedulerUrl}`);
    const schedResponse = await fetch(schedulerUrl);
    if (!schedResponse.ok) throw new Error(`Scheduler Trigger Failed: ${schedResponse.statusText}`);
    logStep('Trigger Scheduler', 'success');

    // 4. Poll for results (Wait up to 30 seconds for background worker)
    logStep('Awaiting Worker Completion', 'pending');
    let completed = false;
    for (let i = 0; i < 6; i++) {
        await new Promise(r => setTimeout(r, 5000)); // 5s intervals
        const { data: check } = await supabase
            .from('company_research')
            .select('id')
            .eq('company_name', testCompany)
            .single();
        
        if (check) {
            completed = true;
            break;
        }
        console.log(`Polling... attempt ${i+1}`);
    }

    if (!completed) throw new Error('Worker timed out or failed to update database');
    logStep('Worker Verification', 'success', 'Found result in company_research');

    // 5. AFERR Schema Dry Run (New Step)
    logStep('AFERR Dry Run', 'pending');
    const { error: aferrError } = await supabase
        .from('diagnostic_results')
        .insert([{
            organization_name: `AFERR_TEST_${Math.floor(Math.random() * 100)}`,
            region: 'TestRegion',
            overall_score: 85,
            signal_detection_score: 90,
            emotional_framing_score: 80,
            resource_reallocation_score: 85,
            decision_alignment_score: 75,
            execution_responsiveness_score: 95,
            metadata: {
                source: 'smoke-test',
                evivve_mock: true,
                latency_ms: 45
            }
        }]);
    
    if (aferrError) throw new Error(`AFERR Dry Run Failed: ${aferrError.message}`);
    logStep('AFERR Schema Validation', 'success', 'Inserted AFERR data with metadata');

    // 6. Check Analytics Aggregation
    const analyticsUrl = `${baseUrl.replace(/\/$/, '')}/api/analytics/global`;
    const analyticsRes = await fetch(analyticsUrl);
    const analyticsData = await analyticsRes.json();
    const foundInRegions = analyticsData.some(r => r.region === 'TestRegion');
    
    if (!foundInRegions) throw new Error('Analytics failed to include the test region');
    logStep('Analytics Aggregation', 'success');

    results.final_status = 'passed';
    console.log('✅ System Smoke Test Passed!');

  } catch (err) {
    console.error('❌ Smoke Test Failed:', err.message);
    logStep('Failure Diagnosis', 'failed', err.message);
    results.final_status = 'failed';
  } finally {
    // Cleanup - remove test data so we don't pollute the real index
    await supabase.from('research_queue').delete().eq('company_name', testCompany);
    await supabase.from('company_research').delete().eq('company_name', testCompany);
    await supabase.from('diagnostic_results').delete().like('organization_name', 'AFERR_TEST_%');
    
    // Log final test result to a dedicated audit table (if it exists)
    try {
        await supabase.from('scraper_logs').insert([{
            status: results.final_status,
            duration_ms: Date.now() - startTime,
            summary: `Automated Smoke Test: ${results.final_status}. Steps: ${results.steps.length}`,
            signals_found: results.steps.filter(s => s.status === 'success').length
        }]);
    } catch (e) {
        console.error('Failed to log smoke test result:', e.message);
    }
  }
};
