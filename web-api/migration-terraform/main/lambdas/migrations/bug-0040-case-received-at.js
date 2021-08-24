const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  INITIAL_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
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

      const petitionItem = caseRecord.docketEntries.find(
        entry => entry.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
      );

      if (!item.isPaper && item.receivedAt !== petitionItem.receivedAt) {
        // an electronic filing where the received at was changed from that of the petition

        applicationContext.logger.info(
          `Updating case.receivedAt from ${item.receivedAt} to ${petitionItem.receivedAt} to match petition.`,
          {
            pk: item.pk,
            sk: item.sk,
          },
        );

        item.receivedAt = petitionItem.receivedAt;
      }

      new Case(item, { applicationContext }).validateWithLogging(
        applicationContext,
      );
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
