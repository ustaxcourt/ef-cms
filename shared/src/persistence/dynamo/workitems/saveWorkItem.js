const client = require('../../dynamodbClientService');
const { getWorkItemById } = require('./getWorkItemById');
const { reassignWorkItem } = require('./syncWorkItems');
const { stripInternalKeys } = require('../../awsDynamoPersistence');
const { getCaseByCaseId } = require('../cases/getCaseByCaseId');

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

  const caseToUpdate = await getCaseByCaseId({
    caseId: workItemToSave.caseId,
    applicationContext,
  });

  caseToUpdate.documents.forEach(document =>
    document.workItems.forEach(workItem => {
      if (workItem.workItemId === workItemToSave.workItemId) {
        Object.assign(workItem, workItemToSave);
      }
    }),
  );

  await client.put({
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: caseToUpdate.caseId,
      sk: caseToUpdate.caseId,
      ...caseToUpdate,
    },
  });

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
