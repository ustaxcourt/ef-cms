const createApplicationContext = require('../../../../src/applicationContext');
const {
  CHIEF_JUDGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');

const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    // if item is a case
    if (item.pk.includes('case|') && item.sk.includes('case|')) {
      // if it has a docketEntry item.pending AND item.isLegacyServed
      const docketEntries = await documentClient
        .query({
          ExpressionAttributeNames: {
            '#pk': 'pk',
            '#sk': 'sk',
          },
          ExpressionAttributeValues: {
            ':pk': `case|${item.docketNumber}`,
            ':sk': 'docket-entry|',
          },
          KeyConditionExpression: '#pk = :pk',
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Items;
        });

      // docketEntries.some (pending === true and isLegacyServed === true)
      // call updateCaseAutomaticBlocked
      // save the case and stuff
    }
  }
};

exports.migrateItems = migrateItems;
