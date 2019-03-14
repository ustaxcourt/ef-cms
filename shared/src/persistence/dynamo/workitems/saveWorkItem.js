const client = require('../../dynamodbClientService');
const { getWorkItemById } = require('./getWorkItemById');
const { reassignWorkItem } = require('./syncWorkItems');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { getCaseByCaseId } = require('../cases/getCaseByCaseId');
const { saveVersionedCase } = require('../cases/saveCase');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');

exports.saveWorkItem = async ({ workItemToSave, applicationContext }) => {
  const user = applicationContext.getCurrentUser();

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

  await createMappingRecord({
    applicationContext,
    item: {
      workItemId: workItemToSave.workItemId,
    },
    pkId: user.userId,
    skId: new Date().toISOString(),
    type: 'sentWorkItem',
  });

  // section sent box
  await createMappingRecord({
    applicationContext,
    item: {
      workItemId: workItemToSave.workItemId,
    },
    pkId: user.section,
    skId: new Date().toISOString(),
    type: 'sentWorkItem',
  });

  const workItem = await client.put({
    applicationContext,
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
  });

  return stripInternalKeys(workItem);
};
