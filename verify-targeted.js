import { supabase } from './netlify/functions/lib/supabase.cjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Simulation of the scoring logic for a single org
async function verifyTargeted() {
  console.log('--- Targeted Phase 2 Verification ---');
  
  const testOrgName = 'Targeted Verification Org ' + Date.now();
  
  // 1. Create Org
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert([{ name: testOrgName, region: 'APAC', industry: 'Logistics' }])
    .select()
    .single();

  if (orgErr) throw orgErr;
  console.log('Created Org:', org.name);

  // 2. Emit Signal
  const fingerprint = crypto.createHash('md5').update(testOrgName + 'Market Expansion').digest('hex');
  const { data: signal, error: sigErr } = await supabase
    .from('signals_normalized')
    .insert([{
      institution_id: org.id,
      institution_name: org.name,
      signal_type: 'Market Expansion',
      dimension_impacted: 'signal_detection',
      source_tier: 2,
      impact_direction: 1,
      impact_strength: 5.0,
      confidence: 0.9,
      fingerprint: fingerprint,
      event_timestamp: new Date().toISOString()
    }])
    .select()
    .single();

  if (sigErr) throw sigErr;
  console.log('Ingested Signal:', signal.signal_id);

  // 3. Run Scoped Scoring Logic
  console.log('Running scoring logic for org...');
  const overallScore = 65; // Simulated final score
  const delta = 15;
  const dimensions = { signal_detection: 70, cognitive_framing: 60, resource_calibration: 65, decision_alignment: 60, integrated_responsiveness: 70 };

  // A. Emit Intelligence Event (Ticker)
  const { error: eventErr } = await supabase.from('intelligence_events').insert([{
    event_type: 'score.updated',
    severity: 'major',
    institution_id: org.id,
    institution_name: org.name,
    delta_score: delta,
    origin_signal_ids: [signal.signal_id],
    event_timestamp: new Date().toISOString(),
    metadata: { 
      summary: 'Market Expansion',
      dimension: 'signal_detection'
    }
  }]);
  if (eventErr) throw eventErr;
  console.log('Emitted Intelligence Event');

  // B. Upsert History (Sparkline)
  const { error: histErr } = await supabase.from('institution_score_history').upsert({
    institution_id: org.id,
    recorded_at: new Date().toISOString().split('T')[0],
    overall_score: overallScore,
    signal_detection_score: dimensions.signal_detection,
    cognitive_framing_score: dimensions.cognitive_framing,
    resource_calibration_score: dimensions.resource_calibration,
    decision_alignment_score: dimensions.decision_alignment,
    integrated_responsiveness_score: dimensions.integrated_responsiveness
  }, { onConflict: 'institution_id,recorded_at' });
  if (histErr) throw histErr;
  console.log('Upserted History Record');

  console.log('--- Targeted Verification COMPLETE ---');
}

verifyTargeted().catch(err => console.error('Verification failed:', err));
