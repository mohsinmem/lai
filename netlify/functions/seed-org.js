const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { data, error } = await supabase
      .from('organizations')
      .upsert([{ 
        name: "PG Miners", 
        region: "Global", 
        industry: "Mining/Technology" 
      }], { onConflict: 'name' });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'ok', message: 'Successfully seeded PG Miners' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: err.message })
    };
  }
};
