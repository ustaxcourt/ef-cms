const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  IrsPractitioner,
} = require('../../../../../shared/src/business/entities/IrsPractitioner');
const {
  Practitioner,
} = require('../../../../../shared/src/business/entities/Practitioner');
const {
  PrivatePractitioner,
} = require('../../../../../shared/src/business/entities/PrivatePractitioner');
const { User } = require('../../../../../shared/src/business/entities/User');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];

  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      const updatedCase = new Case(item, {
        applicationContext,
      }).validate();

      itemsAfter.push({ ...item, petitioners: updatedCase.petitioners });
    } else if (item.pk.startsWith('user|') && item.sk.startsWith('user|')) {
      if (item.entityName === 'Practitioner') {
        const updatedPractitioner = new Practitioner(item, {
          applicationContext,
        }).validate();

        itemsAfter.push({ ...item, ...updatedPractitioner });
      } else {
        const updatedUser = new User(item, {
          applicationContext,
        }).validate();

        itemsAfter.push({ ...item, ...updatedUser });
      }
    } else if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('privatePractitioner|')
    ) {
      const updatedPrivatePractitioner = new PrivatePractitioner(item, {
        applicationContext,
      }).validate();

      itemsAfter.push({ ...item, ...updatedPrivatePractitioner });
    } else if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('irsPractitioner|')
    ) {
      const updatedIrsPractitioner = new IrsPractitioner(item, {
        applicationContext,
      }).validate();

      itemsAfter.push({ ...item, ...updatedIrsPractitioner });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
