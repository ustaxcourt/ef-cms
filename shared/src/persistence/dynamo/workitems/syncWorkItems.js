/* istanbul ignore file */
// TODO: tests will come in the next PR
const persistence = require('../../awsDynamoPersistence');
const client = require('../../dynamodbClientService');

exports.syncWorkItems = async ({
  applicationContext,
  caseToSave,
  currentCaseState,
}) => {
  let currentWorkItems = [];
  let newWorkItems = [];
  (currentCaseState.documents || []).forEach(
    document =>
      (currentWorkItems = [...currentWorkItems, ...(document.workItems || [])]),
  );
  (caseToSave.documents || []).forEach(
    document =>
      (newWorkItems = [...newWorkItems, ...(document.workItems || [])]),
  );

  for (let workItem of newWorkItems) {
    const existing = currentWorkItems.find(
      item => item.workItemId === workItem.workItemId,
    );
    if (!existing) {
      if (workItem.assigneeId) {
        await persistence.createMappingRecord({
          pkId: workItem.assigneeId,
          skId: workItem.workItemId,
          type: 'workItem',
          applicationContext,
        });
      }

      await persistence.createMappingRecord({
        applicationContext,
        pkId: workItem.section,
        skId: workItem.workItemId,
        type: 'workItem',
      });

      await client.put({
        applicationContext,
        TableName: `efcms-${applicationContext.environment.stage}`,
        Item: {
          pk: workItem.workItemId,
          sk: workItem.workItemId,
          ...workItem,
        },
      });
    } else {
      // the item exists in the current state, but check if the assigneeId changed
      if (workItem.assigneeId !== existing.assigneeId) {
        // the item has changed assignees, delete item
        await exports.reassignWorkItem({
          applicationContext,
          existingWorkItem: existing,
          workItemToSave: workItem,
        });
      }
    }
  }
};

exports.reassignWorkItem = async ({
  applicationContext,
  existingWorkItem,
  workItemToSave,
}) => {
  if (existingWorkItem.assigneeId) {
    await persistence.deleteMappingRecord({
      applicationContext,
      pkId: existingWorkItem.assigneeId,
      skId: workItemToSave.workItemId,
      type: 'workItem',
    });
  }

  await persistence.createMappingRecord({
    applicationContext,
    pkId: workItemToSave.assigneeId,
    skId: workItemToSave.workItemId,
    type: 'workItem',
  });
};
