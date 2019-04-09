const client = require('../../dynamodbClientService');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const {
  deleteMappingRecord,
} = require('../../dynamo/helpers/deleteMappingRecord');

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
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
    applicationContext,
  });
};
