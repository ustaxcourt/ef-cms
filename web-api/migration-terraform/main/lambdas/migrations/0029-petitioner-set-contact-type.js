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

      // if 1 petitioner on case && without contactType, make contactType = primary
      // if >1 petitioner on case but none have contactType, make the first one the primary contact ( verify ?? ) and rest otherPetitioner contactType
      // else if > 1 petitioner on case && without contactType && otherFilerType, make contactType = otherFiler

      if (item.partyPrimary) {
        const contactPrimaryId = getContactPrimary(caseRecord).contactId;
        filers.push(contactPrimaryId);
        item.partyPrimary = undefined;
      }

      if (item.partySecondary) {
        const contactSecondaryId = getContactSecondary(caseRecord).contactId;
        filers.push(contactSecondaryId);
        item.partySecondary = undefined;
      }

      item.filers = filers;

      new DocketEntry(item, {
        applicationContext,
        petitioners: caseRecord.petitioners,
      }).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
