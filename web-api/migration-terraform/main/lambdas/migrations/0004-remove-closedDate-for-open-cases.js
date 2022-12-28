const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  CLOSED_CASE_STATUSES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];

  for (const item of items) {
    if (isCaseRecord(item)) {
      // if item is a case
      // if item has a closedDate AND status is NOT CLOSED_CASE_STATUSES
      // set closedDate to undefined
      // validate case
      if (item.closedDate && !CLOSED_CASE_STATUSES.includes(item.status)) {
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
        delete item.closedDate;
        new Case(item, { applicationContext }).validateWithLogging(
          applicationContext,
        );
      }
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
