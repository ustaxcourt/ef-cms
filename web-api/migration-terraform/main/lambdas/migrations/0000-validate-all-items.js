const createApplicationContext = require('../../../../src/applicationContext');
const { getRecordSize } = require('../utilities/getRecordSize');
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  for (const item of items) {
    const entityConstructor = applicationContext.getEntityByName(
      item.entityName,
    );

    const itemSize = Buffer.byteLength(JSON.stringify(item)) / 1024;
    applicationContext.logger.info(`JSON Item Size: ${itemSize.toFixed(1)}kb`);

    let recordSize;
    try {
      recordSize = getRecordSize(item) / 1000;
    } catch (e) {
      applicationContext.logger.info(
        `DynamoDB Record Size Error: ${e}, ${item}`,
      );
    }
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
