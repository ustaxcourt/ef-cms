import { seedData } from './cav-submitted-cases';

module.exports = [
  ...require('./efcms-local.json'),
  ...require('./caseWithOver100PendingItems.json'),
  ...require('./caseWithAmendedAndRedactedBriefs.json'),
  ...seedData,
];
