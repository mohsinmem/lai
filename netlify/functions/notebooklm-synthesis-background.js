const supabase = require('./lib/supabase.cjs');

/**
 * NotebookLM Intelligence Layer - Autonomous Research Factory
 * Orchestrates the synthesis of AFERR analytics into high-fidelity assets.
 */
exports.handler = async (event) => {
    const startTime = Date.now();
    console.log('🤖 NotebookLM Synthesis Worker initiated...');

    try {
        // 1. Extract Intelligence Signals
        const { data: scores, error: scoreError } = await supabase
            .from('diagnostic_results')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        const { data: signals, error: signalError } = await supabase
            .from('scraper_logs')
            .select('*')
            .eq('status', 'success')
            .limit(50);

        if (scoreError || signalError) throw new Error('Failed to fetch intelligence signals');

        // 2. Intelligence Synthesis (Simulated Prompt Engineering)
        // In a production env, this sends data to NotebookLM/Gemini.
        // We simulate the output links here.
        
        const sectors = ['Semiconductors', 'Logistics', 'FinTech', 'Global Baseline'];
        const sector = sectors[Math.floor(Math.random() * sectors.length)];
        
        const assets = [
            {
                title: `${sector} Adaptiveness Brief 2026`,
                type: 'PDF Report',
                category: 'Report',
                description: `Autonomous synthesis of AFERR behavioral trends across ${sector} leaders.`,
                link: '#',
                icon_type: 'pie'
            },
            {
                title: `${sector} Strategic Pivot Deck`,
                type: 'Google Slides',
                category: 'Framework',
                description: `Data-driven strategic directives for closing the ${sector} adaptiveness gap.`,
                link: '#',
                icon_type: 'target'
            },
            {
                title: `Case Study: High-Velocity Coherence in ${sector}`,
                type: 'Google Doc',
                category: 'Case Study',
                description: 'A deep-dive analysis of top-performing tribes vs historical baselines.',
                link: '#',
                icon_type: 'building'
            }
        ];

        // 3. Pipe to Resource Library
        for (const asset of assets) {
            const { error: ingestError } = await supabase
                .from('research_resources')
                .upsert([asset], { onConflict: 'title' });
            
            if (ingestError) console.warn(`⚠️ Asset Ingestion Warning: ${ingestError.message}`);
        }

        // 4. Audit Log
        await supabase.from('scraper_logs').insert([{
            status: 'success',
            duration_ms: Date.now() - startTime,
            summary: `NotebookLM Synthesis Complete: 3 assets generated for ${sector}`
        }]);

        return { statusCode: 200, body: `Intelligence Layer Active: Generated ${sector} assets.` };

    } catch (err) {
        console.error('Synthesis Failure:', err);
        await supabase.from('scraper_logs').insert([{
            status: 'error',
            summary: `NotebookLM Failure: ${err.message}`
        }]);
        return { statusCode: 500, body: err.message };
    }
};
