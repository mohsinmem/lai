const { createClient } = require('@supabase/supabase-js');

// Use service role key for backend functions to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
