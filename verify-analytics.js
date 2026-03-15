import { supabase } from './netlify/functions/lib/supabase.cjs';
import dotenv from 'dotenv';
dotenv.config();

async function verifyAnalytics() {
  console.log('--- Verifying Phase 3A: Analytics Foundation ---');

  // 1. Fetch latest metrics for an institution
  const { data: metrics, error: metricsErr } = await supabase
    .from('institution_metrics')
    .select('*')
    .limit(5);

  if (metricsErr) {
    console.error('Failed to fetch metrics:', metricsErr);
    return;
  }

  if (!metrics?.length) {
    console.warn('No metrics found. Ensure scoring-worker has run.');
  } else {
    const m = metrics[0];
    console.log(`[PASS] Metrics Found for Org ID: ${m.institution_id}`);
    console.log(`       Volatility 30D: ${m.volatility_30d.toFixed(2)}`);
    console.log(`       Turbulence 7D: ${m.turbulence_7d}`);
    console.log(`       Signal Last 24h: ${m.signal_last_24h}`);
    console.log(`       Dominant Dimension: ${m.dominant_dimension}`);
  }

  // 2. Fetch enriched intelligence events
  const { data: events, error: eventErr } = await supabase
    .from('intelligence_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (eventErr) {
    console.error('Failed to fetch events:', eventErr);
  } else if (events?.length) {
    const e = events[0];
    console.log(`[PASS] Enriched Event Metadata Found:`);
    console.log(`       Region: ${e.metadata?.region}`);
    console.log(`       Sector: ${e.metadata?.sector}`);
    console.log(`       Tier: ${e.metadata?.source_tier}`);
  }

  console.log('--- Verification COMPLETE ---');
}

verifyAnalytics().catch(console.error);
