const createApplicationContext = require('../../../../src/applicationContext');
const {
  getRecordSize,
} = require('../../../../../shared/src/persistence/dynamo/helpers/getRecordSize');
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  for (const item of items) {
    const entityConstructor = applicationContext.getEntityByName(
      item.entityName,
    );

    const itemSize = Buffer.byteLength(JSON.stringify(item)) / 1024;
    applicationContext.logger.info(`JSON Item Size: ${itemSize.toFixed(1)}kb`);

    const recordSize = getRecordSize(item) / 1000;
    applicationContext.logger.info(`DynamoDB Record Size: ${recordSize}kb`);

    if (entityConstructor) {
      new entityConstructor(item, {
        applicationContext,
      }).validateForMigration();
    }
  }
  return items;
};

exports.migrateItems = migrateItems;
