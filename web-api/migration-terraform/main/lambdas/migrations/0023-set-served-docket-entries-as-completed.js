const createApplicationContext = require('../../../../src/applicationContext');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|') &&
      item.servedAt &&
      item.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE
    ) {
      item.processingStatus = DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

      new DocketEntry(item, { applicationContext }).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
