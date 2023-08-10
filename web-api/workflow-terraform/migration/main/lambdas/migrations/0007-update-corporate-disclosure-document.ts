import { INITIAL_DOCUMENT_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';

const isDocketEntry = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

const isCase = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

export const migrateItems = items => {
  const itemsAfter: any[] = [];

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
      } else if (
        item.previousDocument?.documentType ===
        'Order for Ownership Disclosure Statement'
      ) {
        item.previousDocument.documentType =
          'Order for Corporate Disclosure Statement';
      }
    } else if (isCase(item) && item.orderForOds !== undefined) {
      item.orderForCds = item.orderForOds;
      delete item.orderForOds;
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};
