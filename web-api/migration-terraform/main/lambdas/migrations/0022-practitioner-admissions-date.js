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
  for (const item of items) {
    if (
      item.sk.startsWith('user|') &&
      item.pk.startsWith('user|') &&
      [
        ROLES.privatePractitioner,
        ROLES.irsPractitioner,
        ROLES.inactivePractitioner,
      ].includes(item.role)
    ) {
      item.admissionsDate = formatDateString(
        item.admissionsDate,
        FORMATS.YYYYMMDD,
      );

      const practitioner = new Practitioner(item, {
        applicationContext,
      })
        .validate()
        .toRawObject();

      itemsAfter.push({ ...item, ...practitioner });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
