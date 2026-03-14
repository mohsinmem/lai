const { supabase } = require('../netlify/functions/lib/supabase.cjs');

async function seedMicrosoft() {
  console.log('🌱 Seeding Canonical Microsoft Entry...');

  const orgName = 'Microsoft';

  // 1. Tier 0: Sovereign (Multi: 1.2x)
  await supabase.from('diagnostic_results').insert([{
    organization_name: orgName,
    source_type: 'SOVEREIGN',
    overall_score: 85,
    signal_detection_score: 90,
    cognitive_framing_score: 88,
    decision_alignment_score: 82,
    resource_calibration_score: 84,
    integrated_responsiveness_score: 81,
    metadata: { source: 'Sovereign Research' }
  }]);

  // 2. Tier 1: Behavioral (Multi: 1.0x) - The Reality
  await supabase.from('diagnostic_results').insert([{
    organization_name: orgName,
    source_type: 'BEHAVIORAL',
    overall_score: 65,
    signal_detection_score: 70,
    cognitive_framing_score: 68,
    decision_alignment_score: 62,
    resource_calibration_score: 64,
    integrated_responsiveness_score: 61,
    metadata: { source: 'Evivve Simulation' }
  }]);

  // 3. Tier 2: Perceptual (Multi: 0.8x) - The Belief (High Dissonance)
  // Logic: Perceptual > Behavioral + 15% (e.g., 65 * 1.15 = 74.75)
  // Let's set it to 85.
  await supabase.from('diagnostic_results').insert([{
    organization_name: orgName,
    source_type: 'PERCEPTUAL',
    overall_score: 88, 
    signal_detection_score: 90,
    cognitive_framing_score: 92,
    decision_alignment_score: 85,
    resource_calibration_score: 87,
    integrated_responsiveness_score: 86,
    metadata: { source: 'Leadership Survey' }
  }]);

  console.log('✅ Microsoft Seeding Complete.');
}

seedMicrosoft().catch(console.error);
