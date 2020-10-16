const createApplicationContext = require('../../../../src/applicationContext');
const {
  CaseDeadline,
} = require('../../../../../shared/src/business/entities/CaseDeadline');

const applicationContext = createApplicationContext({});

const migrateItems = items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.includes('case-deadline|') &&
      item.sk.includes('case-deadline|')
    ) {
      // generate sortableDocketNumber in the constructor
      const updatedDeadline = new CaseDeadline(item, { applicationContext })
        .validate()
        .toRawObject();

      itemsAfter.push({
        ...item,
        ...updatedDeadline,
      });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
