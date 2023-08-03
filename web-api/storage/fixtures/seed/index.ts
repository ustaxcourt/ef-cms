import { seedData } from './cav-submitted-cases';

module.exports = [...require('./efcms-local.json'), ...seedData];
