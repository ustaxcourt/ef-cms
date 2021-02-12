const createApplicationContext = require('../../../../src/applicationContext');
const {
  Correspondence,
} = require('../../../../../shared/src/business/entities/Correspondence');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('correspondence|') &&
      !item.entityName
    ) {
      const updatedCorrespondence = new Correspondence(item, {
        applicationContext,
      }).validate();

      itemsAfter.push({ ...item, ...updatedCorrespondence });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
