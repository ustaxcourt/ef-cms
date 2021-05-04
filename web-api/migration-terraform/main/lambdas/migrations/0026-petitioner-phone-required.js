const createApplicationContext = require('../../../../src/applicationContext');
const {
  Petitioner,
} = require('../../../../../shared/src/business/entities/contacts/Petitioner');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      item.petitioners.forEach(petitioner => {
        if (!petitioner.phone) {
          petitioner.phone = 'N/A';
          new Petitioner(petitioner, { applicationContext }).validate();
        }
      });

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
