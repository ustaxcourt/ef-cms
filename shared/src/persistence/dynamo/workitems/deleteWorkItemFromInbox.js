const { deleteMappingRecord } = require('../helpers/deleteMappingRecord');

exports.deleteWorkItemFromInbox = async ({ workItem, applicationContext }) => {
  if (workItem.assigneeId) {
    await deleteMappingRecord({
      applicationContext,
      pkId: workItem.assigneeId,
      skId: workItem.workItemId,
      type: 'workItem',
    });
  }

  await deleteMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });
};
