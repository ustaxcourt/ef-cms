const client = require('../../dynamodbClientService');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { getCaseByCaseId } = require('../cases/getCaseByCaseId');
const { getWorkItemById } = require('./getWorkItemById');
const { reassignWorkItem } = require('./syncWorkItems');
const { saveVersionedCase } = require('../cases/saveCase');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.saveWorkItem = async ({
  workItemToSave,
  createOutboxEntries,
  applicationContext,
}) => {
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

  if (createOutboxEntries) {
    const date = new Date().toISOString();
    await createMappingRecord({
      applicationContext,
      item: {
        workItemId: workItemToSave.workItemId,
      },
      pkId: user.userId,
      skId: date,
      type: 'outbox',
    });

    await createMappingRecord({
      applicationContext,
      item: {
        workItemId: workItemToSave.workItemId,
      },
      pkId: user.section,
      skId: date,
      type: 'outbox',
    });
  }

  const workItem = await client.put({
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
    applicationContext,
  });

  return stripInternalKeys(workItem);
};
