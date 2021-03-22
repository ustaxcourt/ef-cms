const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('case|') && item.sk.startsWith('case|')) {
      const updatedCase = new Case(item, { applicationContext })
        .validate()
        .toRawObject();
      delete item.contactPrimary;

      applicationContext.logger.info(
        'Creating case entity to add contactPrimary to case.petitioners',
        { pk: item.pk, sk: item.sk },
      );

      itemsAfter.push({ ...item, ...updatedCase });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
