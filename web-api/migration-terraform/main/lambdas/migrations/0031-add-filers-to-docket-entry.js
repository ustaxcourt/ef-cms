const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../../../../../shared/src/business/entities/cases/Case');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|') &&
      !item.filers
    ) {
      const filers = [];

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

      if (!caseRecord.docketNumber) {
        applicationContext.logger.info(
          `0031: Docket entry ${item.sk} does not have an associated case.`,
          {
            pk: item.pk,
            sk: item.sk,
          },
        );
      } else {
        if (item.partyPrimary) {
          const contactPrimary = getContactPrimary(caseRecord);

          if (contactPrimary) {
            filers.push(contactPrimary.contactId);
          } else {
            applicationContext.logger.info(
              `0031: Docket entry ${item.sk} has partyPrimary=true but no contactPrimary was found on the case.`,
              {
                pk: item.pk,
                sk: item.sk,
              },
            );
          }
          item.partyPrimary = undefined;
        }

        if (item.partySecondary) {
          const contactSecondary = getContactSecondary(caseRecord);

          if (contactSecondary) {
            filers.push(contactSecondary.contactId);
          } else {
            applicationContext.logger.info(
              `0031: Docket entry ${item.sk} has partySecondary=true but no contactSecondary was found on the case.`,
              {
                pk: item.pk,
                sk: item.sk,
              },
            );
          }

          item.partySecondary = undefined;
        }

        item.filers = filers;

        new DocketEntry(item, {
          applicationContext,
          petitioners: caseRecord.petitioners,
        }).validate();
      }

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
