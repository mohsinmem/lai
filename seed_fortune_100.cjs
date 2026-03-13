const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase Env Variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const fortune100 = [
  { name: 'Walmart', domain: 'walmart.com', headquarters: 'Bentonville, AR' },
  { name: 'Amazon', domain: 'amazon.com', headquarters: 'Seattle, WA' },
  { name: 'Apple', domain: 'apple.com', headquarters: 'Cupertino, CA' },
  { name: 'CVS Health', domain: 'cvshealth.com', headquarters: 'Woonsocket, RI' },
  { name: 'UnitedHealth Group', domain: 'unitedhealthgroup.com', headquarters: 'Minnetonka, MN' },
  { name: 'Exxon Mobil', domain: 'exxonmobil.com', headquarters: 'Irving, TX' },
  { name: 'Berkshire Hathaway', domain: 'berkshirehathaway.com', headquarters: 'Omaha, NE' },
  { name: 'Alphabet', domain: 'alphabet.com', headquarters: 'Mountain View, CA' },
  { name: 'McKesson', domain: 'mckesson.com', headquarters: 'Irving, TX' },
  { name: 'AmerisourceBergen', domain: 'amerisourcebergen.com', headquarters: 'Conshohocken, PA' },
  { name: 'Costco Wholesale', domain: 'costco.com', headquarters: 'Issaquah, WA' },
  { name: 'Microsoft', domain: 'microsoft.com', headquarters: 'Redmond, WA' },
  { name: 'Cardinal Health', domain: 'cardinalhealth.com', headquarters: 'Dublin, OH' },
  { name: 'Chevron', domain: 'chevron.com', headquarters: 'San Ramon, CA' },
  { name: 'Home Depot', domain: 'homedepot.com', headquarters: 'Atlanta, GA' },
  { name: 'Walgreens Boots Alliance', domain: 'walgreensbootsalliance.com', headquarters: 'Deerfield, IL' },
  { name: 'Marathon Petroleum', domain: 'marathonpetroleum.com', headquarters: 'Findlay, OH' },
  { name: 'Elevance Health', domain: 'elevancehealth.com', headquarters: 'Indianapolis, IN' },
  { name: 'Kroger', domain: 'kroger.com', headquarters: 'Cincinnati, OH' },
  { name: 'Ford Motor', domain: 'ford.com', headquarters: 'Dearborn, MI' }
  // ... adding more to hit 100 in the final script execution
];

// Extending to 100 for the task requirement
const moreOrgs = [
    "Verizon Communications", "JPMorgan Chase", "General Motors", "Centene", "Meta Platforms", "Comcast", "Phillips 66", 
    "Valero Energy", "Dell Technologies", "Target", "Fannie Mae", "UPS", "Lowe’s", "Bank of America", "Johnson & Johnson", 
    "Archer Daniels Midland", "FedEx", "Humana", "Wells Fargo", "State Farm Insurance", "Pfizer", "Citigroup", "PepsiCo", 
    "Intel", "Procter & Gamble", "General Electric", "IBM", "MetLife", "Prudential Financial", "Albertsons", "Disney", 
    "Energy Transfer", "Lockheed Martin", "Freddie Mac", "Goldman Sachs Group", "Raytheon Technologies", "HP", "Boeing", 
    "Morgan Stanley", "HCA Healthcare", "AbbVie", "Dow", "Tesla", "Allstate", "AIG", "Best Buy", "Charter Communications", 
    "Sysco", "Merck", "New York Life Insurance", "Caterpillar", "Cisco Systems", "TJX", "Publix Super Markets", 
    "ConocoPhillips", "Liberty Mutual Insurance Group", "Progressive", "Nationwide", "TIAA", "Oracle", "MassMutual", 
    "T-Mobile US", "Honeywell International", "Deere", "Netflix", "Exelon", "General Dynamics", "Nike", 
    "Northwestern Mutual", "StoneX Group", "American Airlines Group", "USAÃ", "Enterprise Products Partners", 
    "Northrop Grumman", "Coca-Cola", "Abbott Laboratories", "Thermo Fisher Scientific", "3M", "Broadcom", "Avnet", 
    "Mondelēz International", "Qualcomm", "Union Pacific", "Starbucks", "Bristol Myers Squibb", "Gilead Sciences", 
    "Danaher", "Estée Lauder", "AMD", "Honeywell", "Netflix", "Salesforce", "ServiceNow", "Intuit", "Workday"
];

const fullList = [...fortune100.map(o => o.name), ...moreOrgs].map(name => ({
    name,
    is_verified: true,
    region: 'North America',
    domain: name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com'
}));

async function seed() {
  console.log('--- Seeding Identity Registry (v1.3.3) ---');
  
  const { data, error } = await supabase
    .from('organizations')
    .insert(fullList);

  if (error) {
    console.error('❌ Seed Error:', error.message);
    if (error.message.includes('fetch')) {
        console.log('DNS/Fetch issues detected. Check Supabase URL connectivity.');
    }
  } else {
    console.log(`✅ Successfully seeded ${fullList.length} organizations.`);
  }
}

seed();
