const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      delete item.archivedCorrespondences;
      delete item.archivedDocketEntries;
      delete item.correspondence;
      delete item.docketEntries;
      delete item.hearings;
      delete item.irsPractitioners;
      delete item.privatePractitioners;

      new Case(
        { ...item },
        {
          applicationContext,
        },
      ).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
