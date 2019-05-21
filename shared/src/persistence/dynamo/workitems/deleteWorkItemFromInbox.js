const { deleteSectionInboxRecord } = require('./deleteSectionInboxRecord');
const { deleteUserInboxRecord } = require('./deleteUserInboxRecord');

exports.deleteWorkItemFromInbox = ({
  workItem,
  applicationContext,
  deleteFromSection = true,
}) => {
  const requests = [];
  if (workItem.assigneeId) {
    requests.push(
      deleteUserInboxRecord({
        applicationContext,
        workItem,
      }),
    );
  }

  if (deleteFromSection) {
    requests.push(
      deleteSectionInboxRecord({
        applicationContext,
        workItem,
      }),
    );
  }

  return Promise.all(requests);
};
