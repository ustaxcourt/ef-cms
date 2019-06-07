const {
  createSectionInboxRecord,
} = require('../workitems/createSectionInboxRecord');

exports.addWorkItemToSectionInbox = async ({
  workItem,
  applicationContext,
}) => {
  await createSectionInboxRecord({
    applicationContext,
    workItem,
  });
};
