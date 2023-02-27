const {
  INITIAL_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const isDocketEntry = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

const isCase = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

export const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isDocketEntry(item)) {
      if (item.documentType === 'Ownership Disclosure Statement') {
        item.documentType =
          INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType;
      } else if (
        item.documentType === 'Order for Ownership Disclosure Statement'
      ) {
        item.documentType = 'Order for Corporate Disclosure Statement';
      } else if (
        item.previousDocument?.documentType === 'Ownership Disclosure Statement'
      ) {
        item.previousDocument.documentType =
          INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType;
      }
    } else if (isCase(item) && item.orderForOds !== undefined) {
      item.orderForCds = item.orderForOds;
      delete item.orderForOds;
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};
