import { seedData } from './cav-submitted-cases';

export const seedEntries = [...require('./efcms-local.json'), ...seedData];
