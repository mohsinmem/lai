const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function purge() {
  const targets = ['gew', 'nrwe', 'Independent Tribe', 'test', 'Test Org', 'Powerpuff Girls', 'Karen'];
  console.log(`🚀 Purge Protocol Initiated: Removing ${targets.join(', ')}...`);

  for (const name of targets) {
    const { error: err1 } = await supabase.from('diagnostic_results').delete().ilike('organization_name', name);
    const { error: err2 } = await supabase.from('organizations').delete().ilike('name', name);
    
    if (err1) console.error(`❌ Error purging hits for ${name}:`, err1.message);
    if (err2) console.error(`❌ Error purging org ${name}:`, err2.message);
  }

  console.log('✅ Purge Complete.');
}

purge();
