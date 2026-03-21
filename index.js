import 'dotenv/config';
import { startScheduler } from './src/scheduler.js';

console.log('🤖 OpsAgent starting...');
startScheduler();
