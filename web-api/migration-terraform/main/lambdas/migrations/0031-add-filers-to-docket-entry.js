const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../../../../../shared/src/business/entities/cases/Case');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|')) {
      const filers = [];

      const fullCase = await documentClient
        .query({
          ExpressionAttributeNames: {
            '#pk': 'pk',
          },
          ExpressionAttributeValues: {
            ':pk': `case|${item.docketNumber}`,
          },
          KeyConditionExpression: '#pk = :pk',
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Items;
        });

      const caseRecord = aggregateCaseItems(fullCase);

      if (item.partyPrimary) {
        const contactPrimaryId = getContactPrimary(caseRecord).contactId;
        filers.push(contactPrimaryId);
        item.partyPrimary = undefined;
      }

      if (item.partySecondary) {
        const contactSecondaryId = getContactSecondary(fullCase).contactId;
        filers.push(contactSecondaryId);
        item.partySecondary = undefined;
      }

      item.filers = filers;

      new DocketEntry(item, {
        applicationContext,
      }).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
