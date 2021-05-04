const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    // loop through petitioners
    // if no phone, add 'n/a'
    // new petitioner entity and validate
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      itemsAfter.push({ ...item, ...updatedCaseRaw });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
