const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CONTACT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      item.petitioners.forEach(petitioner => {
        if (petitioner.contactType === CONTACT_TYPES.otherPetitioners) {
          petitioner.contactType = CONTACT_TYPES.otherPetitioner;
        }
      });

      new Case(item, {
        applicationContext,
      }).validateWithLogging();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
