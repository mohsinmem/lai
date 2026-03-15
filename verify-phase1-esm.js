import { supabase } from './netlify/functions/lib/supabase.cjs';
import { handler as scoringHandler } from './netlify/functions/scoring-worker.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function verify() {
  console.log('--- Phase 1: Gate 2 Smoke Test (ESM) ---');

  const secret = process.env.ORION_SECRET;

  // 1. Create a dummy institution for testing
  const testOrgName = 'Smoke Test Org ESM ' + Date.now();
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert([{ name: testOrgName, region: 'Global', industry: 'Technology' }])
    .select()
    .single();

  if (orgErr) {
    console.error('Failed to create test org:', orgErr);
    return;
  }
  console.log(`[PASS] Created Test Org: ${testOrgName} (ID: ${org.id})`);

  // 2. Simulate Orion Scout Signal Emission
  const fingerprint = crypto.createHash('md5').update(testOrgName + 'Strategic Pivot' + 'http://smoke-test-esm.com').digest('hex');
  const testSignal = {
    institution_id: org.id,
    institution_name: testOrgName,
    signal_type: 'Strategic Pivot',
    dimension_impacted: 'signal_detection',
    source_tier: 3,
    source_name: 'Smoke Test Scraper ESM',
    source_url: 'http://smoke-test-esm.com',
    impact_direction: 1,
    impact_strength: 8.5, // High strength
    confidence: 1.0,
    fingerprint: fingerprint
  };

  const { data: signal, error: sigErr } = await supabase
    .from('signals_normalized')
    .insert([testSignal])
    .select()
    .single();

  if (sigErr) {
    console.error('Failed to emit test signal:', sigErr);
    return;
  }
  console.log(`[PASS] Signal Ingested: ${signal.signal_id}`);

  // 3. Trigger Scoring Engine Logic
  console.log('[3] Triggering Scoring Engine...');
  await scoringHandler({ body: JSON.stringify({ secret }) });

  // 4. Verify Intelligence Event Generation
  const { data: events, error: eventErr } = await supabase
    .from('intelligence_events')
    .select('*')
    .eq('institution_id', org.id)
    .order('created_at', { ascending: false });

  if (eventErr || !events?.length) {
    console.error('Failed to detect intelligence event:', eventErr);
    return;
  }

  const event = events[0];
  console.log(`[PASS] Intelligence Event Emitted: ${event.event_id}`);
  console.log(`       Severity: ${event.severity}`);
  console.log(`       Score Delta: ${event.delta_score}`);
  
  if (event.origin_signal_ids.includes(signal.signal_id)) {
    console.log(`[PASS] Provenance Chain Verified (Linked to signal)`);
  } else {
    console.error(`[FAIL] Provenance Chain Broken`);
  }

  console.log('--- Phase 1: Gate 2 COMPLETE ---');
}

verify().catch(err => {
  console.error('Smoke test failed with error:', err);
});
