import { createRequire } from 'module';
import 'dotenv/config';

const require = createRequire(import.meta.url);
const { handler } = require('./netlify/functions/notebooklm-synthesis-background.js');
const { supabase } = require('./netlify/functions/lib/supabase.cjs');

async function main() {
  console.log("Triggering notebooklm worker...");
  try {
    const res = await handler({});
    console.log("Worker returned:", res);
  } catch(e) { console.error("Worker error:", e) }
  
  const resources = await supabase.from('research_resources').select('title, type');
  console.log("Research Assets:", resources.data);

  const diagCount1 = await supabase.from('diagnostic_results').select('id', { count: 'exact' });
  const diagCount2 = await supabase.from('diagnostic_results').select('id', { count: 'exact' }).not('overall_score', 'is', null);
  console.log(`Diagnostics Total: ${diagCount1?.count}. With score: ${diagCount2?.count}`);
  
  const sample = await supabase.from('diagnostic_results').select('organization_name, overall_score').limit(5);
  console.log("Sample:", sample.data);
}
main();
