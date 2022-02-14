const {
  DOCKET_ENTRY_SEALED_TO_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const isDocketEntry = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isDocketEntry(item) && item.isLegacySealed) {
      item.sealedTo = DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL;
    }

    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
