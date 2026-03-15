import { handler } from './netlify/functions/scoring-worker.js';
import dotenv from 'dotenv';
dotenv.config();

async function trigger() {
  console.log('Triggering scoring worker logic...');
  const result = await handler({});
  console.log('Worker Result:', result.body);
}

trigger().catch(console.error);
