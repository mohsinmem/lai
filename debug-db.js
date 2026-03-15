import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function check() {
  const orgName = 'SMOKE_TEST_ORG';
  
  // 1. Check Org
  const { data: orgs } = await supabase.from('organizations').select('id, name').ilike('name', 'Targeted Verification Org%');
  if (!orgs?.length) {
    console.error('Org not found');
    return;
  }
  const org = orgs[orgs.length - 1]; // Use latest
  console.log('Org ID:', org.id, 'Name:', org.name);

  // 2. Check Signals
  const { data: signals } = await supabase.from('signals_normalized').select('count').eq('institution_id', org.id);
  console.log('Signals Count:', signals?.length || 0);

  // 3. Check Events
  const { data: events } = await supabase.from('intelligence_events').select('*').eq('institution_id', org.id).order('created_at', { ascending: false });
  console.log('Events Count:', events?.length || 0);
  if (events?.length) {
    console.log('Latest Event:', events[0].metadata?.summary, 'Severity:', events[0].severity);
  }

  // 4. Check History
  const { data: history } = await supabase.from('institution_score_history').select('*').eq('institution_id', org.id).order('recorded_at', { ascending: false });
  console.log('History Records:', history?.length || 0);
}

check();
