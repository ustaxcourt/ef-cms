const createApplicationContext = require('../../../../src/applicationContext');
const {
  createISODateAtStartOfDayEST,
} = require('../../../../../shared/src/business/utilities/DateHandler');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|')) {
      if (item.receivedAt) {
        item.receivedAt = createISODateAtStartOfDayEST(item.receivedAt);
      }

      new DocketEntry(item, { applicationContext }).validate();

      applicationContext.logger.info('Updating receivedAt for docketEntry', {
        pk: item.pk,
        sk: item.sk,
      });

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
