const createApplicationContext = require('../../../../src/applicationContext');
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.gsi1pk && item.gsi1pk.startsWith('connection')) {
      item.gsi1pk = 'connection';

      applicationContext.logger.info(
        'Updating gsi1pk to just "connection" without connectionId',
        {
          pk: item.pk,
          sk: item.sk,
        },
      );
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
