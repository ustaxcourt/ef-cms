const { deleteMappingRecord } = require('../helpers/deleteMappingRecord');

exports.deleteWorkItemFromInbox = ({
  workItem,
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
