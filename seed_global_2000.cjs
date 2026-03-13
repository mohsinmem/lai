const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase Env Variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const global2000Names = [
  "JPMorgan Chase", "Berkshire Hathaway", "ICBC", "Amazon", "Saudi Aramco", "Agricultural Bank of China", "Alphabet", "Bank of America", "Microsoft", "China Construction Bank",
  "Apple", "Bank of China", "ExxonMobil", "Toyota Motor", "HSBC Holdings", "Wells Fargo", "UnitedHealth Group", "Walmart", "Samsung Electronics", "Chevron",
  "Shell", "Morgan Stanley", "Allianz", "RBC", "Ping An Insurance Group", "PetroChina", "Santander", "Verizon Communications", "China Mobile", "Goldman Sachs Group",
  "Meta Platforms", "Citigroup", "Tencent Holdings", "NextEra Energy", "ConocoPhillips", "TotalEnergies", "Reliance Industries", "China Life Insurance", "Pfizer", "Comcast",
  "BP", "Equinor", "Nestle", "BMO", "CNOOC", "PepsiCo", "BYD", "Enel", "Mizuho Financial", "RTX",
  "Anheuser-Busch InBev", "Costco Wholesale", "Cisco Systems", "Oracle", "The Home Depot", "Broadcom", "Tesla", "Zurich Insurance Group", "The Walt Disney Company", "Mercedes-Benz Group",
  "CVS Health", "Industrial Bank", "Merck & Co.", "Novartis", "CITIC", "Bank of Nova Scotia", "General Motors", "Coca-Cola", "AbbVie", "Airbus",
  "Cigna", "Contemporary Amperex Technology", "Tokio Marine Holdings", "GE Aerospace", "Charles Schwab", "BHP Group", "Visa", "Ford Motor", "MetLife", "Honda Motor",
  "Caterpillar", "Barclays", "Rio Tinto", "China State Construction Engineering", "Hon Hai Precision", "Eli Lilly", "VINCI", "Westpac Banking Group", "Shanghai Pudong Development", "Hyundai Motor",
  "ENGIE", "Accenture", "Société Générale", "CaixaBank", "China Telecom", "SAP", "ING Group", "Enbridge", "Manulife", "Charter Communications",
  "United Parcel Service", "Bristol Myers Squibb", "Duke Energy", "Hitachi", "E.ON", "Linde", "Apollo Global Management", "Philip Morris International", "Stellantis", "Nordea Bank",
  "British American Tobacco", "Midea Group", "Prudential Financial", "Allstate", "Banco do Brasil", "Netflix", "Travelers", "BlackRock", "Honeywell International", "Lockheed Martin",
  "Qualcomm", "McKesson", "Qatar National Bank", "Southern Company", "International Holding Company", "Uber", "China Pacific Insurance", "Standard Chartered", "Amgen", "PICC",
  "HCA Healthcare", "Eni", "Lowe's", "KKR", "Truist Financial", "GSK", "Banco Bradesco", "Danaher", "General Dynamics", "Target",
  "Discover Financial Services", "Sanofi", "Progressive", "Baidu", "ABB", "American Express", "Anthem", "Aon", "ASML Holding", "AstraZeneca",
  "Automatic Data Processing", "AXA", "Banco Bilbao Vizcaya Argentaria", "Bank of Montreal", "Bank of New York Mellon", "BASF", "Bayer", "Blackstone Group", "Booking Holdings", "Boston Scientific"
];

const regions = ['North America', 'EMEA', 'APAC', 'LATAM'];

const fullList = global2000Names.map((name, i) => ({
    name,
    is_verified: true,
    region: i % 4 === 0 ? 'North America' : i % 4 === 1 ? 'EMEA' : i % 4 === 2 ? 'APAC' : 'LATAM',
    domain: name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com'
}));

async function seed() {
  console.log(`--- Seeding Master Registry (v1.4.0) — ${fullList.length} Entities ---`);
  
  // 1. Get existing names
  const { data: existingData } = await supabase.from('organizations').select('name');
  const existingNames = new Set((existingData || []).map(o => o.name));
  
  const toInsert = fullList.filter(o => !existingNames.has(o.name));
  console.log(`🚀 Found ${toInsert.length} new organizations to seed.`);

  if (toInsert.length === 0) {
    console.log('✅ Master Registry already hydrated.');
    return;
  }

  // 2. Chunking to avoid large request payload issues
  const chunkSize = 50;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    const { error } = await supabase
      .from('organizations')
      .insert(chunk);

    if (error) {
      console.error(`❌ Chunk ${i/chunkSize + 1} Error:`, error.message);
    } else {
      console.log(`✅ Chunk ${i/chunkSize + 1} seeded.`);
    }
  }
}

seed();
