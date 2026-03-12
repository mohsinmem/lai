const supabase = require('./lib/supabase');

/**
 * Netlify Scheduled Function: research-scheduler
 * Runs periodically (e.g., hourly) to pick companies from the queue
 * and trigger the research worker.
 */
exports.handler = async (event) => {
  console.log('Research Scheduler triggered...');

  try {
    // 1. Get next batch of companies from the queue
    let { data: queueItems, error: queueError } = await supabase
      .from('research_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(3);

    if (queueError) throw queueError;

    // 1.5 Self-Seeding: If queue is empty, repopulate it
    if (!queueItems || queueItems.length === 0) {
      console.log('Queue empty. Seeding new batch of global companies...');
      const seedCompanies = [
        { company_name: 'Microsoft', region: 'North America', status: 'pending' },
        { company_name: 'Siemens', region: 'Europe', status: 'pending' },
        { company_name: 'Toyota', region: 'APAC', status: 'pending' },
        { company_name: 'Samsung', region: 'APAC', status: 'pending' },
        { company_name: 'HSBC', region: 'Europe', status: 'pending' },
        { company_name: 'Tesla', region: 'North America', status: 'pending' },
        { company_name: 'Aramco', region: 'Middle East', status: 'pending' },
        { company_name: 'Tencent', region: 'APAC', status: 'pending' }
      ];
      
      const { data: seeded, error: seedError } = await supabase
        .from('research_queue')
        .insert(seedCompanies)
        .select();
        
      if (seedError) throw seedError;
      queueItems = seeded.slice(0, 3);
    }

    // 2. Trigger worker for each company
    // Note: In Netlify, we ideally trigger background functions
    for (const item of queueItems) {
      console.log(`Queuing research for: ${item.company_name}`);
      
      // Update status to 'processing'
      await supabase
        .from('research_queue')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', item.id);

      // Trigger the research worker background function
      console.log(`Triggering background worker for: ${item.company_name}`);
      
      // We use the absolute URL if possible, or construct it from the request headers
      // For Netlify, background functions are fire-and-forget
      await fetch(`${process.env.URL || 'https://lai.institute'}/.netlify/functions/research-worker-background`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          company_id: item.id, 
          company_name: item.company_name,
          region: item.region 
        })
      }).catch(err => console.error(`Failed to trigger worker for ${item.company_name}:`, err));
    }

    return {
      statusCode: 200,
      body: `Triggered research for ${queueItems.length} companies.`
    };
  } catch (err) {
    console.error('Scheduler Error:', err);
    return { statusCode: 500, body: 'Scheduler failed' };
  }
};
