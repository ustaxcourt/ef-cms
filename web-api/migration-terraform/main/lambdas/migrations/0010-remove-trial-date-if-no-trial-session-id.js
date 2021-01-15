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
      item.pk.startsWith('case|') &&
      item.sk.startsWith('case|') &&
      item.trialDate &&
      item.status !== CASE_STATUS_TYPES.calendared
    ) {
      const trialDateCutoff = '2020-11-20T00:00:00.000Z';
      if (item.trialDate < trialDateCutoff || !item.trialSessionId) {
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

      // There are case records in dynamo that have docketEntries, this is
      // either a result of an old migration that saved docketEntries
      // improperly on the case or old data that has never been migrated
      // to remove that property.
      item.docketEntries = undefined;

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
