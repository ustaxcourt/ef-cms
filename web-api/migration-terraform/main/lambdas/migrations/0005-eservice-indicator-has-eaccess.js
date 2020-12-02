const {
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.includes('case|') && item.sk.includes('case|')) {
      const { contactPrimary, contactSecondary } = item;

      if (
        contactPrimary &&
        contactPrimary.hasEAccess === true &&
        contactPrimary.serviceIndicator !==
          SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
      ) {
        item.contactPrimary.serviceIndicator =
          SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }

      if (
        contactSecondary &&
        contactSecondary.hasEAccess === true &&
        contactSecondary.serviceIndicator !==
          SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
      ) {
        item.contactSecondary.serviceIndicator =
          SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }

      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
