const client = require('../../dynamodbClientService');
const { createSectionInboxRecord } = require('./createSectionInboxRecord');
const { createUserInboxRecord } = require('./createUserInboxRecord');
const { deleteSectionInboxRecord } = require('./deleteSectionInboxRecord');
const { deleteUserInboxRecord } = require('./deleteUserInboxRecord');

exports.reassignWorkItem = async ({
  applicationContext,
  existingWorkItem,
  workItemToSave,
}) => {
  if (existingWorkItem.assigneeId) {
    await deleteUserInboxRecord({
      applicationContext,
      workItem: existingWorkItem,
    });
  }

  if (existingWorkItem.section !== workItemToSave.section) {
    await deleteSectionInboxRecord({
      applicationContext,
      workItem: existingWorkItem,
    });

    await createSectionInboxRecord({
      applicationContext,
      workItem: workItemToSave,
    });
  }

  await createUserInboxRecord({
    applicationContext,
    workItem: workItemToSave,
  });
};

exports.updateWorkItem = async ({ applicationContext, workItemToSave }) => {
  await client.put({
    Item: {
      pk: `workitem-${workItemToSave.workItemId}`,
      sk: `workitem-${workItemToSave.workItemId}`,
      ...workItemToSave,
    },
    applicationContext,
  });
};
