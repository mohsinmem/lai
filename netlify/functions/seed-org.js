const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Seed Init:', { 
  url: supabaseUrl?.substring(0, 15) + '...', 
  hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
  allKeysSame: process.env.SUPABASE_SERVICE_KEY === process.env.SUPABASE_KEY,
  keyPrefix: supabaseKey?.substring(0, 10)
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { data, error } = await supabase
      .from('organizations')
      .insert([{ 
        name: "PG Miners", 
        region: "Global", 
        industry: "Mining/Technology" 
      }]);

    if (error && !error.message.includes('duplicate key value')) {
      throw error;
    }

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
