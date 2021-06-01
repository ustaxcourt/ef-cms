const createApplicationContext = require('../../../../src/applicationContext');

const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      (item.pk.startsWith('user|') && item.sk.startsWith('work-item')) ||
      (item.pk.startsWith('section|') && item.sk.startsWith('work-item'))
    ) {
      applicationContext.logger.info('Deleting work item inbox record', {
        pk: item.pk,
        sk: item.sk,
      });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
