const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
);

async function purgeTestData() {
  const blacklist = ['Powerpuff Girls', 'Karen', 'Karen and Friends!', 'Test'];
  
  console.log('Starting database sanitization...');
  
  for (const name of blacklist) {
    const { error, count } = await supabase
      .from('diagnostic_results')
      .delete({ count: 'exact' })
      .eq('organization_name', name);
    
    if (error) {
      console.error(`Error purging "${name}" from diagnostic_results:`, error.message);
    } else {
      console.log(`Purged "${name}" from diagnostic_results: ${count || 0} records removed.`);
    }
  }
  
  for (const name of blacklist) {
    const { error, count } = await supabase
      .from('company_research')
      .delete({ count: 'exact' })
      .eq('company_name', name);
    
    if (error) {
        console.error(`Error purging "${name}" from company_research:`, error.message);
    } else {
      console.log(`Purged "${name}" from company_research: ${count || 0} records removed.`);
    }
  }

  console.log('Sanitization complete.');
}

purgeTestData();

