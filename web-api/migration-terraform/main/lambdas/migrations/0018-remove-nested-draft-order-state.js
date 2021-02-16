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
      (item.draftOrderState.documentContents ||
        item.draftOrderState.richText ||
        item.draftOrderState.draftOrderState)
    ) {
      delete item.draftOrderState.documentContents;
      delete item.draftOrderState.richText;
      delete item.draftOrderState.draftOrderState;

      const docketEntryEntity = new DocketEntry(item, {
        applicationContext,
      });

      itemsAfter.push({
        ...item,
        ...docketEntryEntity.validate().toRawObject(),
      });

      const docketNumber = item.pk.split('|')[1];
      applicationContext.logger.info(
        `removing nested draftOrderState, documentContents, and richText for ${docketNumber} and docket entry id ${item.docketEntryId}`,
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
