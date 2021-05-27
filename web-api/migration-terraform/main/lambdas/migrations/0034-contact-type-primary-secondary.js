const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('case|') &&
      // check if status is not NEW ?!
      item.status !== CASE_STATUS_TYPES.new
    ) {
      item.petitioners.forEach(petitioner => {
        const petitionerContactTypes = [
          CONTACT_TYPES.primary,
          CONTACT_TYPES.secondary,
          CONTACT_TYPES.otherPetitioner,
        ];

        if (petitionerContactTypes.includes(petitioner.contactType)) {
          petitioner.contactType = CONTACT_TYPES.petitioner;
        }
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
