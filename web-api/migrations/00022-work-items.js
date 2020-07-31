const createApplicationContext = require('../src/applicationContext');
const { Document } = require('../../shared/src/business/entities/Document');
const { isDocumentRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isDocumentRecord(item)) {
    if (item.workItems && item.workItems[0]) {
      item.workItem = item.workItems[0];
      const otherWorkItems = item.workItems.splice(1);

      for (const workItemToDelete of otherWorkItems) {
        await documentClient.delete({
          Key: {
            pk: `work-item|${workItemToDelete.workItemId}`,
            sk: `work-item|${workItemToDelete.workItemId}`,
          },
          TableName: tableName,
        });
      }

      const updatedDocument = new Document(item, { applicationContext })
        .validate()
        .toRawObject();

      return { ...item, ...updatedDocument };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
