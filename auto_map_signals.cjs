const { supabase } = require('./netlify/functions/lib/supabase.cjs');

async function autoMap() {
  console.log('--- Starting Identity Resolution (v1.3.3) ---');

  // 1. Fetch all unclaimed signals
  const { data: unclaimed, error: uError } = await supabase
    .from('diagnostic_results')
    .select('id, organization_name')
    .is('verified_entity_id', null);

  if (uError) {
    console.error('❌ Error fetching signals:', uError.message);
    if (uError.message.includes('verified_entity_id')) {
        console.error('CRITICAL: Schema migration v1.3.3 has not been applied! Please run v1.3.3_mapping_migration.sql in Supabase SQL Editor.');
    }
    return;
  }

  // 2. Fetch all verified entities
  const { data: verified, error: vError } = await supabase
    .from('organizations')
    .select('id, name, domain')
    .eq('is_verified', true);

  if (vError) {
    console.error('❌ Error fetching entities:', vError.message);
    return;
  }

  console.log(`Found ${unclaimed.length} unclaimed signals and ${verified.length} verified entities.`);

  let mappedCount = 0;
  for (const sig of unclaimed) {
    const name = sig.organization_name.toLowerCase();
    
    // Simple domain/name matching logic
    const match = verified.find(v => 
      name.includes(v.name.toLowerCase()) || 
      (v.domain && name.includes(v.domain.split('.')[0]))
    );

    if (match) {
      console.log(`🔗 Mapping "${sig.organization_name}" to "${match.name}"`);
      await supabase
        .from('diagnostic_results')
        .update({ verified_entity_id: match.id })
        .eq('id', sig.id);
      mappedCount++;
    }
  }

  console.log(`✅ Auto-mapping complete. ${mappedCount} signals resolved.`);

  // 3. Hard-Purge Test Data
  console.log('--- Purging Blacklisted Entities ---');
  const blacklist = ['Powerpuff', 'Karen', 'gew', 'nrwe', 'test', 'Test Org'];
  
  for (const b of blacklist) {
    const { error: pError } = await supabase
      .from('diagnostic_results')
      .delete()
      .ilike('organization_name', `%${b}%`);
    
    if (pError) console.error(`Failed to purge ${b}:`, pError.message);
    else console.log(`🗑️ Purged all records matching "${b}"`);
  }

  const { error: oError } = await supabase
    .from('organizations')
    .delete()
    .not('is_verified', 'eq', true)
    .in('name', blacklist);
  
  console.log('--- Cleansing Complete ---');
}

autoMap();
