const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('case|') &&
      item.trialDate
    ) {
      //fixme
      //or if trial date is before november 20, 2020

      //if (trialDate < createISODateString('')) item.trialDate = undefined;

      new Case(
        { ...item },
        {
          applicationContext,
        },
      ).validate();

      //fixme
      //if it has no pending items, due dates or is not manually blocked - then unblock it

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
