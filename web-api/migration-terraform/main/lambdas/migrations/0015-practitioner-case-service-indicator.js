const {
  IrsPractitioner,
} = require('../../../../../shared/src/business/entities/IrsPractitioner');
const {
  PrivatePractitioner,
} = require('../../../../../shared/src/business/entities/PrivatePractitioner');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.includes('Practitioner') &&
      !item.email
    ) {
      item.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_PAPER;

      if (item.role === 'privatePractitioner') {
        new PrivatePractitioner(item).validate();
      } else {
        new IrsPractitioner(item).validate();
      }

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
