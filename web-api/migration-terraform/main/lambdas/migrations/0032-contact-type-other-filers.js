const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CONTACT_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      item.petitioners.forEach(petitioner => {
        if (petitioner.contactType === CONTACT_TYPES.otherFiler) {
          if (petitioner.otherFilerType === UNIQUE_OTHER_FILER_TYPE) {
            petitioner.contactType = CONTACT_TYPES.intervenor;
          } else {
            petitioner.contactType = CONTACT_TYPES.participant;
          }
        }

        delete petitioner.otherFilerType;
      });

      new Case(item, {
        applicationContext,
      }).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
