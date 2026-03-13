const TIER_WEIGHTS = { 'OBSERVED': 1.0, 'PERCEIVED': 0.6, 'INFERRED': 0.4 };
const SENIORITY_MULTIPLIERS = { 'c_suite': 1.5, 'svp_vp_director': 1.2, 'middle_management': 1.0, 'individual_contributor': 0.8, 'default': 1.0 };

function calculateScore(signals) {
    let totalWeight = 0;
    let weightedSum = 0;
    
    signals.forEach(s => {
        const tierWeight = TIER_WEIGHTS[s.tier] || 1.0;
        const seniorityMultiplier = SENIORITY_MULTIPLIERS[s.seniority] || 1.0;
        const finalWeight = tierWeight * seniorityMultiplier;
        
        totalWeight += finalWeight;
        weightedSum += s.score * finalWeight;
        
        console.log(`Signal: Tier=${s.tier} (w=${tierWeight}), Seniority=${s.seniority} (m=${seniorityMultiplier}) => Weight=${finalWeight.toFixed(2)}, Score=${s.score}`);
    });

    const final = Math.round(weightedSum / totalWeight);
    console.log(`--- FINAL WEIGHTED SCORE: ${final} ---`);
    return final;
}

console.log('Test 1: Mixed Tiers and Seniority');
const test1 = [
    { tier: 'OBSERVED', seniority: 'middle_management', score: 80 }, // w=1.0, m=1.0 => 1.0
    { tier: 'PERCEIVED', seniority: 'c_suite', score: 90 },           // w=0.6, m=1.5 => 0.9
    { tier: 'INFERRED', seniority: 'individual_contributor', score: 70 } // w=0.4, m=0.8 => 0.32
];
calculateScore(test1);

console.log('\nTest 2: C-Suite Dominance');
const test2 = [
    { tier: 'OBSERVED', seniority: 'individual_contributor', score: 50 }, // w=1.0, m=0.8 => 0.8
    { tier: 'OBSERVED', seniority: 'c_suite', score: 100 }               // w=1.0, m=1.5 => 1.5
];
calculateScore(test2);
