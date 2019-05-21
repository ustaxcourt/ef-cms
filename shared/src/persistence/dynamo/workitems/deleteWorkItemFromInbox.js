const { deleteSectionInboxRecord } = require('./deleteSectionInboxRecord');
const { deleteUserInboxRecord } = require('./deleteUserInboxRecord');

exports.deleteWorkItemFromInbox = ({
  workItem,
  applicationContext,
  deleteFromSection = true,
}) => {
  console.log('deleteWorkItemFromInbox', workItem.assigneeId);
  const requests = [];
  if (workItem.assigneeId) {
    console.log('we are here', workItem);
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
