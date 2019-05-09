const { deleteMappingRecord } = require('../helpers/deleteMappingRecord');

exports.deleteWorkItemFromInbox = ({
  workItem,
  messageId,
  applicationContext,
  deleteFromSection = true,
}) => {
  const requests = [];
  if (workItem.assigneeId) {
    requests.push(
      deleteMappingRecord({
        applicationContext,
        pkId: workItem.assigneeId,
        skId: workItem.workItemId,
        type: 'workItem',
      }),
    );
    requests.push(
      deleteMappingRecord({
        applicationContext,
        pkId: workItem.assigneeId,
        skId: messageId,
        type: 'unread-message',
      }),
    );
  }

  if (deleteFromSection) {
    requests.push(
      deleteMappingRecord({
        applicationContext,
        pkId: workItem.section,
        skId: workItem.workItemId,
        type: 'workItem',
      }),
    );
  }

  return Promise.all(requests);
};
