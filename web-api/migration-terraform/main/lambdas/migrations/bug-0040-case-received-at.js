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
const { queryFullCase } = require('../utilities');
const applicationContext = createApplicationContext({});

const isElectronicCase = item => {
  const isCaseItem = item.pk.startsWith('case|') && item.sk.startsWith('case|');

  return isCaseItem && !item.isPaper === true;
};

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];

  for (const item of items) {
    if (isElectronicCase(item)) {
      const fullCase = await queryFullCase(documentClient, item.docketNumber);

      const caseRecord = aggregateCaseItems(fullCase);

      const petitionItem = caseRecord.docketEntries.find(
        entry => entry.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
      );

      const daysDiff = applicationContext
        .getUtilities()
        .calculateDifferenceInDays(item.receivedAt, petitionItem.receivedAt);

      if (daysDiff !== 0) {
        // an electronic filing where the received at was changed from that of the petition

        applicationContext.logger.info(
          `Updating case.receivedAt from ${item.receivedAt} to ${petitionItem.receivedAt} to match petition. Difference in days: ${daysDiff}`,
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
