const isCase = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');

const migrateItems = items => {
  const itemsAfter = [];

  for (const item of items) {
    if (isCase(item)) {
      item.sortableDocketNumber = Case.getSortableDocketNumber(
        item.docketNumber,
      );
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
