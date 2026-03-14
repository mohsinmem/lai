const { supabase } = require('./netlify/functions/lib/supabase.cjs');

async function verify() {
  console.log('--- Verifying Adaptiveness Gap Logic ---');
  
  // We'll simulate the api.js logic here to verify it works
  const { data: signals, error } = await supabase
    .from('diagnostic_results')
    .select('*')
    .eq('organization_name', 'Microsoft');

  if (error) {
    console.error(error.message);
    return;
  }

  const TIER_WEIGHTS = { 'SOVEREIGN': 1.2, 'BEHAVIORAL': 1.0, 'PERCEPTUAL': 0.8, 'ENVIRONMENTAL': 0.4 };
  const SENIORITY_MULTIPLIERS = { 'c_suite': 1.5, 'svp_vp_director': 1.2, 'middle_management': 1.0, 'individual_contributor': 0.8, 'default': 1.0 };

  let totalWeight = 0;
  let weightedSum = 0;
  const breakdown = { sovereign: 0, behavioral: 0, perceptual: 0, environmental: 0 };
  let tierSums = { behavioral: 0, perceived: 0, count_obs: 0, count_per: 0 };

  for (const s of signals) {
    const rawType = (s.source_type || 'BEHAVIORAL').toUpperCase();
    const tier =
      (rawType === 'PROPRIETARY' || rawType === 'SOVEREIGN') ? 'SOVEREIGN' :
      (rawType === 'BEHAVIORAL' || rawType === 'SIMULATION' || rawType === 'DIAGNOSTIC') ? 'BEHAVIORAL' :
      (rawType === 'PERCEPTION' || rawType === 'SELF-REPORTED' || rawType === 'SURVEY') ? 'PERCEPTUAL' :
      (rawType === 'RESEARCH' || rawType === 'INFERRED' || rawType === 'SCRAPER') ? 'ENVIRONMENTAL' : 'BEHAVIORAL';
    
    const tierKey = tier.toLowerCase();
    const tierWeight = TIER_WEIGHTS[tier] || 1.0;
    const seniority = s.seniority_level || 'middle_management';
    const seniorityMultiplier = SENIORITY_MULTIPLIERS[seniority] || 1.0;
    const finalWeight = tierWeight * seniorityMultiplier;
    const currentScore = (s.overall_score || s.overall_lai_score || 0);

    breakdown[tierKey]++;
    totalWeight += finalWeight;
    weightedSum += currentScore * finalWeight;

    if (tier === 'BEHAVIORAL') {
      tierSums.behavioral += currentScore * finalWeight;
      tierSums.count_obs += finalWeight;
    } else if (tier === 'PERCEPTUAL') {
      tierSums.perceived += currentScore * finalWeight;
      tierSums.count_per += finalWeight;
    }
  }

  const avgObs = tierSums.count_obs > 0 ? tierSums.behavioral / tierSums.count_obs : 0;
  const avgPer = tierSums.count_per > 0 ? tierSums.perceived / tierSums.count_per : 0;
  const strategic_dissonance = (avgObs > 0 && avgPer > 1.15 * avgObs);
  const is_triangulated = (breakdown.sovereign || 0) > 0 && (breakdown.behavioral || 0) > 0 && (breakdown.perceptual || 0) > 0;

  console.log('Results for Microsoft:');
  console.log(' - Average Behavioral Score:', avgObs.toFixed(2));
  console.log(' - Average Perceptual Score:', avgPer.toFixed(2));
  console.log(' - Strategic Dissonance:', strategic_dissonance);
  console.log(' - Is Triangulated:', is_triangulated);
}

verify();
