const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
    console.log('Seeding organizations table...');
    const { data, error } = await supabase
        .from('organizations')
        .upsert([{ 
            name: "PG Miners", 
            region: "Global", 
            industry: "Mining/Technology" 
        }], { onConflict: 'name' });

    if (error) {
        console.error('Error seeding:', error.message);
        process.exit(1);
    }
    console.log('Successfully seeded PG Miners.');
}

seed();
