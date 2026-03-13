const { supabase } = require('./netlify/functions/lib/supabase.cjs');

async function seedSectors() {
    console.log('🌱 Seeding Target Sectors for Orion Scout...');
    
    const targets = [
        { name: 'NVIDIA', region: 'North America', industry: 'Semiconductors' },
        { name: 'TSMC', region: 'APAC', industry: 'Semiconductors' },
        { name: 'ASML', region: 'Europe', industry: 'Semiconductors' },
        { name: 'FedEx', region: 'North America', industry: 'Logistics' },
        { name: 'Maersk', region: 'Europe', industry: 'Logistics' },
        { name: 'DHL', region: 'Europe', industry: 'Logistics' },
        { name: 'Stripe', region: 'North America', industry: 'FinTech' },
        { name: 'Adyen', region: 'Europe', industry: 'FinTech' },
        { name: 'Ant Group', region: 'APAC', industry: 'FinTech' }
    ];

    for (const target of targets) {
        const { error } = await supabase
            .from('organizations')
            .upsert([target], { onConflict: 'name' });
        
        if (error) {
            console.error(`❌ Failed to seed ${target.name}:`, error.message);
        } else {
            console.log(`✅ Seeded: ${target.name} (${target.industry})`);
        }
    }
}

seedSectors();
