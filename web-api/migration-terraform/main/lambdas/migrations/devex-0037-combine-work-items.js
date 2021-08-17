const createApplicationContext = require('../../../../src/applicationContext');
const {
  WorkItem,
} = require('../../../../../shared/src/business/entities/WorkItem');
const applicationContext = createApplicationContext({});

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];

  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('work-item|') &&
      !item.workItemId
    ) {
      const workItemId = item.sk.split('|')[1];

      const fullWorkItemRecord = await documentClient
        .get({
          Key: {
            pk: `work-item|${workItemId}`,
            sk: `work-item|${workItemId}`,
          },
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Item;
        });

      if (fullWorkItemRecord) {
        new WorkItem(
          { ...item, ...fullWorkItemRecord },
          {
            applicationContext,
          },
        ).validateForMigration();

        itemsAfter.push({
          ...fullWorkItemRecord,
          ...item,
          gsi1pk: `work-item|${workItemId}`,
        });
      } else {
        applicationContext.logger.error(
          `full work item record could not be found for workItemId ${workItemId}`,
        );
      }
    } else if (
      item.pk.startsWith('work-item|') &&
      item.sk.startsWith('work-item|')
    ) {
      //do nothing - gets deleted
    } else if (
      item.pk.startsWith('case|') &&
      item.sk.startsWith('docket-entry|')
    ) {
      delete item.workItem;

      itemsAfter.push(item);
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
