const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { cloneDeep } = require('lodash');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('case|') &&
      item.sk.includes('case|') &&
      item.status === CASE_STATUS_TYPES.calendared &&
      (item.automaticBlocked || item.blocked)
    ) {
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
      const itemToModify = cloneDeep(item);

      if (itemToModify.automaticBlocked) {
        itemToModify.automaticBlocked = undefined;
        itemToModify.automaticBlockedDate = undefined;
        itemToModify.automaticBlockedReason = undefined;
      }

      if (itemToModify.blocked) {
        itemToModify.blocked = undefined;
        itemToModify.blockedDate = undefined;
        itemToModify.blockedReason = undefined;
      }

      new Case(
        { ...caseRecord, ...itemToModify },
        {
          applicationContext,
        },
      ).validate();

      itemsAfter.push(itemToModify);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
