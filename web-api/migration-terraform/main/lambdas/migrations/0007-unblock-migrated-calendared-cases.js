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

      if (caseRecord.automaticBlocked) {
        delete caseRecord.automaticBlocked;
        delete caseRecord.automaticBlockedDate;
        delete caseRecord.automaticBlockedReason;
      }

      if (caseRecord.blocked) {
        delete caseRecord.blocked;
        delete caseRecord.blockedDate;
        delete caseRecord.blockedReason;
      }

      new Case(
        { ...caseRecord, ...item },
        {
          applicationContext,
        },
      ).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
