const { deleteSectionInboxRecord } = require('./deleteSectionInboxRecord');
const { deleteUserInboxRecord } = require('./deleteUserInboxRecord');

exports.deleteWorkItemFromInbox = ({
  applicationContext,
  deleteFromSection = true,
  workItem,
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
