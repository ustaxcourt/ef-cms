const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];

  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('case|') &&
      item.status !== CASE_STATUS_TYPES.new
    ) {
      item.petitioners.forEach(petitioner => {
        if (petitioner.inCareOf) {
          petitioner.additionalName = `c/o ${petitioner.inCareOf}`;
          delete petitioner.inCareOf;
          applicationContext.logger.info(
            `Petitioner ${petitioner.contactId} on case ${item.docketNumber} has had additionalName mapped to inCareOf`,
          );
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
