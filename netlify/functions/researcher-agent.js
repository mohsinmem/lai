const { supabase } = require('./lib/supabase.cjs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { organization_id, mode, seniority, text } = JSON.parse(event.body);

    // Heuristic Pillar Extraction (Simulating Researcher Agent Analysis)
    const pillars = {
      cognitive: 70,
      strategic: 65,
      challenge: 60,
      learning: 68,
      stamina: 62
    };

    const keywords = {
      'Cognitive Framing': ['vision', 'framing', 'mindset', 'perspective', 'reframing', 'narrative'],
      'Strategic Calibration': ['aligned', 'calibrated', 'market', 'adjustment', 'pivot', 'strategy'],
      'Challenge Networks': ['dissent', 'feedback', 'challenge', 'openness', 'network', 'critique'],
      'Learning Agility': ['learning', 'skill', 'acquisition', 'rapid', 'development', 'growth'],
      'Psychological Stamina': ['resilience', 'stamina', 'pressure', 'burnout', 'grit', 'persistence']
    };

    // Simple Sentiment Analysis / Score Modifier
    const positiveWords = ['strong', 'excellent', 'high', 'improving', 'leaders', 'success', 'robust'];
    const negativeWords = ['weak', 'lagging', 'poor', 'decline', 'risk', 'failure', 'fragile', 'dissonance'];

    const getScore = (base, pillarKeywords) => {
      let score = base;
      const lowerText = text.toLowerCase();
      
      pillarKeywords.forEach(kw => {
        if (lowerText.includes(kw)) score += 5;
      });

      positiveWords.forEach(w => {
        if (lowerText.includes(w)) score += 2;
      });

      negativeWords.forEach(w => {
        if (lowerText.includes(w)) score -= 3;
      });

      return Math.min(100, Math.max(0, score));
    };

    pillars.cognitive = getScore(70, keywords['Cognitive Framing']);
    pillars.strategic = getScore(65, keywords['Strategic Calibration']);
    pillars.challenge = getScore(60, keywords['Challenge Networks']);
    pillars.learning = getScore(68, keywords['Learning Agility']);
    pillars.stamina = getScore(62, keywords['Psychological Stamina']);

    const overall = Math.round(Object.values(pillars).reduce((a, b) => a + b, 0) / 5);

    const { data, error } = await supabase.from('diagnostic_results').insert([{
      organization_name: organization_id, // In this model, name is used for resolution
      overall_lai_score: overall,
      cognitive_framing_score: pillars.cognitive,
      strategic_calibration_score: pillars.strategic,
      challenge_networks_score: pillars.challenge,
      learning_agility_score: pillars.learning,
      psychological_stamina_score: pillars.stamina,
      source_type: mode === 'SOVEREIGN' ? 'PROPRIETARY' : 'PERCEPTION',
      seniority_level: seniority,
      metadata: {
        raw_intel: text,
        mode: mode,
        agent: 'Researcher-Agent-v1.0'
      }
    }]).select();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, scores: pillars, overall })
    };
  } catch (err) {
    console.error('Researcher Agent Error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
