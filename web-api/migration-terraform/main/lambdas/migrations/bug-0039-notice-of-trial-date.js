const createApplicationContext = require('../../../../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { queryFullCase } = require('../utilities');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];

  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      const fullCase = await queryFullCase(documentClient, item.docketNumber);

      const caseRecord = aggregateCaseItems(fullCase);

      const hasNoticeOfTrial = !!caseRecord.docketEntries.find(
        entry =>
          entry.eventCode ===
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.eventCode,
      );

      if (item.noticeOfTrialDate && !hasNoticeOfTrial) {
        // there is no notice of trial document, so remove the noticeOfTrialDate
        item.noticeOfTrialDate = undefined;

        applicationContext.logger.info(
          'Removing noticeOfTrialDate for case without NTD on docket record.',
          {
            pk: item.pk,
            sk: item.sk,
          },
        );
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
