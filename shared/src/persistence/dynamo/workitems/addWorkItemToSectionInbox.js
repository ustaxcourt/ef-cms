const {
  createSectionInboxRecord,
} = require('../workitems/createSectionInboxRecord');

exports.addWorkItemToSectionInbox = async ({
  applicationContext,
  workItem,
}) => {
  await createSectionInboxRecord({
    applicationContext,
    workItem,
  });
};
