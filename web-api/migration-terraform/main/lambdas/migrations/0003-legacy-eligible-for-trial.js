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
  const itemsAfter = items;
  for (const item of items) {
    if (
      item.pk.includes('case|') &&
      item.sk.includes('case|') &&
      item.status === CASE_STATUS_TYPES.generalDocketReadyForTrial
    ) {
      const eligibleForTrialRecords = await documentClient
        .query({
          ExpressionAttributeNames: {
            '#gsi1pk': 'gsi1pk',
          },
          ExpressionAttributeValues: {
            ':gsi1pk': `eligible-for-trial-case-catalog|${item.docketNumber}`,
          },
          IndexName: 'gsi1',
          KeyConditionExpression: '#gsi1pk = :gsi1pk',
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Items;
        });

      if (!eligibleForTrialRecords || !eligibleForTrialRecords.length) {
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
        const caseEntity = new Case(caseRecord, {
          applicationContext,
        }).validate();

        if (caseEntity.preferredTrialCity) {
          const { hybrid, nonHybrid } = caseEntity.generateTrialSortTags();

          itemsAfter.push({
            docketNumber: item.docketNumber,
            gsi1pk: `eligible-for-trial-case-catalog|${item.docketNumber}`,
            pk: 'eligible-for-trial-case-catalog',
            sk: nonHybrid,
          });
          itemsAfter.push({
            docketNumber: item.docketNumber,
            gsi1pk: `eligible-for-trial-case-catalog|${item.docketNumber}`,
            pk: 'eligible-for-trial-case-catalog',
            sk: hybrid,
          });
        }
      }
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
