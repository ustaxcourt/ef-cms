const createApplicationContext = require('../../../../src/applicationContext');
const DocketEntry = require('../../../../../shared/src/business/entities/DocketEntry');
const {
  getServedPartiesCode,
} = require('../../../../../shared/src/business/entities/DocketEntry');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|') &&
      item.servedAt &&
      item.servedParties &&
      !item.servedPartiesCode
    ) {
      item.servedParties = getServedPartiesCode(item.servedParties);
      new DocketEntry(item, { applicationContext }).validateForMigration();
      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
