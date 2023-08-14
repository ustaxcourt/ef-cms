// <<<<<<< HEAD
import { seedData } from './cav-submitted-cases';

// module.exports = [
//   ...require('./efcms-local.json'),
//   ...require('./caseWithOver100PendingItems.json'),
//   ...require('./caseWithAmendedAndRedactedBriefs.json'),
//   ...seedData,
// ];
// =======
// export const seedEntries = require('./efcms-local.json');
// >>>>>>> 3c3e735d2766305766bbbecbdf6a51ba643a1972

export const seedEntries = [...require('./efcms-local.json'), ...seedData];

// // eslint-disable-next-line import/no-default-export
// export seedEntries;
