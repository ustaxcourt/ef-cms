const createApplicationContext = require('../../../../src/applicationContext');
const {
  formatDateString,
  FORMATS,
} = require('../../../../../shared/src/business/utilities/DateHandler');
const {
  Practitioner,
} = require('../../../../../shared/src/business/entities/Practitioner');
const {
  ROLES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (let item of items) {
    if (
      item.sk.startsWith('user|') &&
      item.pk.startsWith('user|') &&
      [
        ROLES.privatePractitioner,
        ROLES.irsPractitioner,
        ROLES.inactivePractitioner,
      ].includes(item.role)
    ) {
      console.log('*** before', item.admissionsDate);

      item.admissionsDate = formatDateString(
        item.admissionsDate,
        FORMATS.YYYYMMDD,
      );

      const practitioner = new Practitioner(item, {
        applicationContext,
      })
        .validate()
        .toRawObject();

      console.log('*** after', item.admissionsDate);

      item = { ...item, ...practitioner };
      itemsAfter.push(item);
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
