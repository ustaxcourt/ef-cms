const client = require('../../dynamodbClientService');
const { getWorkItemById } = require('./getWorkItemById');
const { reassignWorkItem } = require('./syncWorkItems');
const { stripInternalKeys } = require('../../awsDynamoPersistence');

exports.saveWorkItem = async ({ workItemToSave, applicationContext }) => {
  const existingWorkItem = await getWorkItemById({
    workItemId: workItemToSave.workItemId,
    applicationContext,
  });

  if (existingWorkItem.assigneeId !== workItemToSave.assigneeId) {
    await reassignWorkItem({
      existingWorkItem,
      workItemToSave,
      applicationContext,
    });
  }

  const workItem = await client.put({
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
  });

  return stripInternalKeys(workItem);
};
