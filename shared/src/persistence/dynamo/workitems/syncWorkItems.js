const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');

const {
  deleteMappingRecord,
} = require('../../dynamo/helpers/deleteMappingRecord');

const client = require('../../dynamodbClientService');

exports.syncWorkItems = async ({
  applicationContext,
  caseToSave,
  currentCaseState,
}) => {
  let currentWorkItems = [];
  let newWorkItems = [];
  ((currentCaseState || {}).documents || []).forEach(
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
        await createMappingRecord({
          applicationContext,
          pkId: workItem.assigneeId,
          skId: workItem.workItemId,
          type: 'workItem',
        });
      }

      await createMappingRecord({
        applicationContext,
        pkId: workItem.section,
        skId: workItem.workItemId,
        type: 'workItem',
      });

      await client.put({
        applicationContext,
        Item: {
          pk: workItem.workItemId,
          sk: workItem.workItemId,
          ...workItem,
        },
        TableName: `efcms-${applicationContext.environment.stage}`,
      });
    } else {
      // the workItem exists in the current state, but check if the assigneeId changed
      if (workItem.assigneeId !== existing.assigneeId) {
        // the item has changed assignees, delete item
        await exports.reassignWorkItem({
          applicationContext,
          existingWorkItem: existing,
          workItemToSave: workItem,
        });
      }

      if (!existing.completedAt && workItem.completedAt) {
        await createMappingRecord({
          applicationContext,
          item: {
            workItemId: existing.workItemId,
          },
          pkId: workItem.section,
          skId: workItem.completedAt,
          type: 'sentWorkItem',
        });
      }

      if (caseToSave.status !== currentCaseState.status) {
        workItem.caseStatus = caseToSave.status;
        if (
          caseToSave.status === 'Batched for IRS' &&
          workItem.isInitializeCase
        ) {
          // TODO: this seems like business logic, refactor
          const batchedMessage = workItem.messages.find(
            message => message.message === 'Petition batched for IRS', // TODO: this probably shouldn't be hard coded
          );
          const { userId, createdAt } = batchedMessage;

          await createMappingRecord({
            applicationContext,
            item: {
              workItemId: existing.workItemId,
            },
            pkId: userId,
            skId: createdAt,
            type: 'sentWorkItem',
          });

          await createMappingRecord({
            applicationContext,
            item: {
              workItemId: existing.workItemId,
            },
            pkId: existing.section,
            skId: createdAt,
            type: 'sentWorkItem',
          });
        } else if (caseToSave.status === 'Recalled') {
          // TODO: this seems like business logic, refactor
          const batchedMessage = workItem.messages.find(
            message => message.message === 'Petition batched for IRS', // TODO: this probably shouldn't be hard coded
          );
          let userId, createdAt;
          if (batchedMessage) {
            userId = batchedMessage.userId;
            createdAt = batchedMessage.createdAt;

            await deleteMappingRecord({
              applicationContext,
              pkId: userId,
              skId: createdAt,
              type: 'sentWorkItem',
            });
            await deleteMappingRecord({
              applicationContext,
              pkId: 'petitions', // TODO: this probably shouldn't be hard coded
              skId: createdAt,
              type: 'sentWorkItem',
            });
          }
        }
        await exports.updateWorkItem({
          applicationContext,
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
    await deleteMappingRecord({
      applicationContext,
      pkId: existingWorkItem.assigneeId,
      skId: workItemToSave.workItemId,
      type: 'workItem',
    });
  }

  if (existingWorkItem.section !== workItemToSave.section) {
    await deleteMappingRecord({
      applicationContext,
      pkId: existingWorkItem.section,
      skId: existingWorkItem.workItemId,
      type: 'workItem',
    });

    await createMappingRecord({
      applicationContext,
      pkId: workItemToSave.section,
      skId: workItemToSave.workItemId,
      type: 'workItem',
    });
  }

  await createMappingRecord({
    applicationContext,
    pkId: workItemToSave.assigneeId,
    skId: workItemToSave.workItemId,
    type: 'workItem',
  });
};

exports.updateWorkItem = async ({ applicationContext, workItemToSave }) => {
  await client.put({
    applicationContext,
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
    TableName: `efcms-${applicationContext.environment.stage}`,
  });
};
