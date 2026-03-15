import { app } from './netlify/functions/api.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`[LAI-DEV-API] Local API Server running at http://localhost:${PORT}`);
  console.log(`[LAI-DEV-API] Health Check: http://localhost:${PORT}/api/health`);
});
