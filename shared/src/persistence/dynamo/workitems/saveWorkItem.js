const client = require('../../dynamodbClientService');
const { getWorkItemById } = require('./getWorkItemById');
const { reassignWorkItem } = require('./syncWorkItems');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
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
    applicationContext,
    caseToSave: caseToUpdate,
    existingVersion: (caseToUpdate || {}).currentVersion,
  });

  const workItem = await client.put({
    applicationContext,
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
    TableName: `efcms-${applicationContext.environment.stage}`,
  });

  return stripInternalKeys(workItem);
};
