const cloneDeep = require('lodash');
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
      console.log('....', itemToModify.automaticBlocked);

      if (itemToModify.automaticBlocked) {
        console.log('....222');
        itemToModify.automaticBlocked = false;
        console.log(itemToModify.automaticBlocked);
        delete itemToModify.automaticBlockedDate;
        console.log('wtf?????', itemToModify.automaticBlocked);
        delete itemToModify.automaticBlockedReason;
      }

      if (itemToModify.blocked) {
        itemToModify.blocked = false;
        delete itemToModify.blockedDate;
        delete itemToModify.blockedReason;
      }

      new Case(
        { ...itemToModify, ...caseRecord },
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
