const {
  INITIAL_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const isDocketEntry = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isDocketEntry(item)) {
      if (item.documentType === 'Ownership Disclosure Statement') {
        item.documentType =
          INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType;
        item.documentTitle =
          INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentTitle;
      }
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
