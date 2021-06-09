const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  PAYMENT_STATUS,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const applicationContext = createApplicationContext({});

const previousUnpaidText = 'Not Paid';

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      if (item.petitionPaymentStatus === previousUnpaidText) {
        item.petitionPaymentStatus = PAYMENT_STATUS.UNPAID;

        new Case(item, { applicationContext }).validateForMigration();
      }

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
