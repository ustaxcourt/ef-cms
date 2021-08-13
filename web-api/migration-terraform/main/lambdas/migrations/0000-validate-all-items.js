const createApplicationContext = require('../../../../src/applicationContext');
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  for (const item of items) {
    const entityConstructor = applicationContext.getEntityByName(
      item.entityName,
    );

    if (entityConstructor) {
      new entityConstructor(item, { applicationContext }).validate();
    }
  }
  throw new Error('fake an error for all entities');
};

exports.migrateItems = migrateItems;
