const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  setServiceIndicatorsForCase,
} = require('../../../../../shared/src/business/utilities/setServiceIndicatorsForCase');

const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
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

      const updatedCase = setServiceIndicatorsForCase(caseRecord);

      item.petitioners = updatedCase.petitioners;

      new Case(item, { applicationContext }).validateWithLogging(
        applicationContext,
      );

      applicationContext.logger.info(
        `Updating case ${item.docketNumber} to add serviceIndicator for any petitioners that don't already have one.`,
        {
          pk: item.pk,
          sk: item.sk,
        },
      );

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
