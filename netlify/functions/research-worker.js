const supabase = require('./lib/supabase');

/**
 * Netlify Background Function: research-worker
 * Triggered via: /.netlify/functions/research-worker
 * Performs one research scrape task at a time to stay within timeouts.
 */
exports.handler = async (event) => {
  const { company_id, company_name } = JSON.parse(event.body || '{}');

  if (!company_name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing company_name' })
    };
  }

  console.log(`Starting background research for: ${company_name}`);

  try {
    // 1. Mock Scrape/Research Process
    // In a real scenario, this would use an LLM or Scraper API
    const mockResearchData = {
       adaptiveness_score: Math.floor(Math.random() * 40) + 60,
       last_researched: new Date().toISOString(),
       research_notes: `Automated research completed for ${company_name}. Detected strong signals in resource reallocation.`
    };

    // 2. Update Supabase
    const { error } = await supabase
      .from('company_research')
      .upsert({ 
        company_name,
        ...mockResearchData
      }, { onConflict: 'company_name' });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Research complete for ${company_name}` })
    };
  } catch (err) {
    console.error('Research Worker Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Research failed' })
    };
  }
};
