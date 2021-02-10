const createApplicationContext = require('../../../../src/applicationContext');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|') &&
      item.draftOrderState &&
      !item.isDraft
    ) {
      const docketEntryEntity = new DocketEntry(
        { ...item, proceedingType: trialSessionRecord.proceedingType },
        {
          applicationContext,
        },
      );

      itemsAfter.push({
        ...item,
        ...docketEntryEntity.validate().toRawObject(),
      });

      const docketNumber = item.pk.split('|')[1];
      applicationContext.logger.info(
        `migrating hearing for case ${docketNumber} and trial session id ${item.trialSessionId}`,
        {
          ...item,
          ...docketEntryEntity.validate().toRawObject(),
        },
      );
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
