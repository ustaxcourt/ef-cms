const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('case|') &&
      item.trialDate
    ) {
      const trialDateCutoff = '2020-11-20T00:00:00.000Z';
      if (item.trialDate < trialDateCutoff) {
        item.trialDate = undefined;
      } else if (!item.trialSessionId) {
        item.trialDate = undefined;
      }

      if (item.automaticBlocked && !item.trialDate) {
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
        const caseEntity = new Case(
          { ...caseRecord, ...item },
          {
            applicationContext,
          },
        );

        const caseDeadlines = await documentClient
          .query({
            ExpressionAttributeNames: {
              '#pk': 'pk',
              '#sk': 'sk',
            },
            ExpressionAttributeValues: {
              ':pk': item.pk,
              ':prefix': 'case-deadline|',
            },
            KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
            TableName: process.env.SOURCE_TABLE,
          })
          .promise()
          .then(res => {
            return res.Items;
          });

        caseEntity.updateAutomaticBlocked({ caseDeadlines });

        if (!caseEntity.automaticBlocked) {
          item.automaticBlocked = false;
          item.automaticBlockedDate = undefined;
          item.automaticBlockedReason = undefined;
        }
      }

      new Case(
        { ...item },
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
