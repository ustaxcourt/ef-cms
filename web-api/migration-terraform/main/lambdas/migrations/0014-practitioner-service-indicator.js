const {
  Practitioner,
} = require('../../../../../shared/src/business/entities/Practitioner');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('user|') &&
      item.sk.startsWith('user|') &&
      item.role.includes('Practitioner') &&
      !item.email
    ) {
      item.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_PAPER;

      new Practitioner(item).validate();

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
