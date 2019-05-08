const { deleteMappingRecord } = require('../helpers/deleteMappingRecord');

exports.deleteWorkItemFromInbox = async ({
  workItem,
  messageId,
  applicationContext,
}) => {
  if (workItem.assigneeId) {
    await deleteMappingRecord({
      applicationContext,
      pkId: workItem.assigneeId,
      skId: workItem.workItemId,
      type: 'workItem',
    });

    await deleteMappingRecord({
      applicationContext,
      pkId: workItem.assigneeId,
      skId: messageId,
      type: 'unread-message',
    });
  }

  await deleteMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });
};
