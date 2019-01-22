const client = require('../../dynamodbClientService');
const { getWorkItemById } = require('./getWorkItemById');
const { reassignWorkItem } = require('./syncWorkItems');
const { stripInternalKeys } = require('../../awsDynamoPersistence');
const { getCaseByCaseId } = require('../cases/getCaseByCaseId');
const { saveVersionedCase } = require('../cases/saveCase');

exports.saveWorkItem = async ({ workItemToSave, applicationContext }) => {
  const existingWorkItem = await getWorkItemById({
    applicationContext,
    workItemId: workItemToSave.workItemId,
  });

  if (existingWorkItem.assigneeId !== workItemToSave.assigneeId) {
    await reassignWorkItem({
      applicationContext,
      existingWorkItem,
      workItemToSave,
    });
  }

  const caseToUpdate = await getCaseByCaseId({
    applicationContext,
    caseId: workItemToSave.caseId,
  });

  caseToUpdate.documents.forEach(document =>
    document.workItems.forEach(workItem => {
      if (workItem.workItemId === workItemToSave.workItemId) {
        Object.assign(workItem, workItemToSave);
      }
    }),
  );

  await saveVersionedCase({
    existingVersion: (caseToUpdate || {}).currentVersion,
    caseToSave: caseToUpdate,
    applicationContext,
  });

  const workItem = await client.put({
    applicationContext,
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
  });

  return stripInternalKeys(workItem);
};
