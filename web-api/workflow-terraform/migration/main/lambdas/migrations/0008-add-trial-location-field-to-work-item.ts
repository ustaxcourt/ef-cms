// // this is needed for various utility functions and writing to dynamo
//  createApplicationContext = require('../../../../src/applicationContext');

// // a utility function for combining all the separate case dynamo records into a single case object
// const {
//   aggregateCaseItems,
// } = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');

// // since we will be adding a field to the case, we need to bring in the case entity to validate our data.
// const {
//   Case,
// } = require('../../../../../shared/src/business/entities/cases/Case');

// // a utility function for fetching all records associated with a case
// const { queryFullCase } = require('../utilities');

// // create a new application context
// const applicationContext = createApplicationContext({});

// // a filter to know when we should modify a record
// const isCaseRecord = item => {
//   return item.pk.startsWith('case|') && item.sk.startsWith('case|');
// };

// // this function will be ran by the migration lambda
// const migrateItems = async (items, documentClient) => {
//   // keep track of all the modified and unchanged records
//   const itemsAfter = [];

  
//   for (const item of items) {
//     // we only care about modifying cases
//     if (isCaseRecord(item)) {
//       // get all the case records
//       const fullCase = await queryFullCase(documentClient, item.docketNumber);

//       // combine them all together
//       const caseRecord = aggregateCaseItems(fullCase);

//       // construct a new case entity, default adjourned to false and validate
//       const theCase = new Case({
//           caseRecord, 
//           adjourned: false
//       }, {
//         applicationContext,
//       }).validateWithLogging(applicationContext); // validating the entity is the most important step

//       item.adjourned = theCase.adjourned;
//     }

//     // push the record into the array to later be returned at the end of this function
//     itemsAfter.push(item);
//   }

//   // return those items to be written to the destination dynamo table
//   return itemsAfter;
// };

// // the migration script must export a migrateItems function
// exports.migrateItems = migrateItems;