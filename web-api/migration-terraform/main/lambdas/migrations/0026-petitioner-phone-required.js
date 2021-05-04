const createApplicationContext = require('../../../../src/applicationContext');
const {
  Petitioner,
} = require('../../../../../shared/src/business/entities/contacts/Petitioner');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      applicationContext.logger.info(
        `Updating case ${item.docketNumber} to add phone number for any petitioners that don't already have one.`,
        {
          pk: item.pk,
          sk: item.sk,
        },
      );

      item.petitioners?.forEach(petitioner => {
        if (!petitioner.phone) {
          petitioner.phone = 'N/A';
          new Petitioner(petitioner, {
            applicationContext,
          }).validateWithLogging(applicationContext);
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
