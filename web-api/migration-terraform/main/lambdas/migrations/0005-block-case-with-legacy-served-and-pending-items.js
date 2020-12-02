const Case = require('../../../../../shared/src/business/entities/cases/Case');
const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  AUTOMATIC_BLOCKED_REASONS,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { createISODateString } = require('../../utilities/DateHandler');

const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('case|') &&
      item.sk.includes('case|') &&
      !item.trialDate
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

      const shouldBlockCase = caseRecord.docketEntries.some(
        entry => entry.pending && entry.isLegacyServed,
      );

      if (shouldBlockCase) {
        item.automaticBlocked = true;
        item.automaticBlockedDate = createISODateString();

        if (item.automaticBlockedReason === AUTOMATIC_BLOCKED_REASONS.dueDate) {
          item.automaticBlockedReason =
            AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate;
        } else {
          item.automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pending;
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
    } else {
      itemsAfter.push(item);
    }
  }
};

exports.migrateItems = migrateItems;
