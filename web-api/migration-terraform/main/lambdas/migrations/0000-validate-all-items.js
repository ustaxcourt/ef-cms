const createApplicationContext = require('../../../../src/applicationContext');
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  for (const item of items) {
    const entityConstructor = applicationContext.getEntityByName(
      item.entityName,
    );

    const itemSize = Buffer.byteLength(JSON.stringify(item)) / 1024;
    console.log(
      'Entity: ',
      item.pk,
      item.sk,
      ' size is ',
      itemSize.toFixed(1),
      'KB',
    );

    if (entityConstructor) {
      new entityConstructor(item, {
        applicationContext,
      }).validateForMigration();
    }
  }
  return items;
};

exports.migrateItems = migrateItems;
