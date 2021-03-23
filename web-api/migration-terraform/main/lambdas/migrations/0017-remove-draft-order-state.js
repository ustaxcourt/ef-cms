const createApplicationContext = require('../../../../src/applicationContext');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|') &&
      item.draftOrderState &&
      !item.isDraft
    ) {
      const docketEntryEntity = new DocketEntry(item, {
        applicationContext,
      });

      itemsAfter.push({
        ...item,
        ...docketEntryEntity.validate().toRawObject(),
        draftOrderState: undefined,
      });

      const docketNumber = item.pk.split('|')[1];
      applicationContext.logger.info(
        `removing draftOrderState for ${docketNumber} and docket entry id ${item.docketEntryId}`,
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
