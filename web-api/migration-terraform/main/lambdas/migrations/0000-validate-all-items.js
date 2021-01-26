const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    switch (item.entityName) {
      case 'Case':
        new Case(item, { applicationContext });
        break;
      default:
        break;
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
