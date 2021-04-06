const createApplicationContext = require('../../../../src/applicationContext');
const {
  DocketEntry,
  getServedPartiesCode,
} = require('../../../../../shared/src/business/entities/DocketEntry');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|')) {
      if (!item.docketNumber) {
        const docketNumber = item.pk.substr(item.pk.indexOf('|') + 1);
        item.docketNumber = docketNumber;
      }

      if (
        item.servedParties &&
        item.servedParties.length > 0 &&
        !item.servedPartiesCode
      ) {
        item.servedPartiesCode = getServedPartiesCode(item.servedParties);
      }

      new DocketEntry(item, { applicationContext }).validate();

      applicationContext.logger.info(
        'Updating docketNumber and/or servedPartiesCode for docketEntry',
        { pk: item.pk, processingStatus: item.processingStatus, sk: item.sk },
      );

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
