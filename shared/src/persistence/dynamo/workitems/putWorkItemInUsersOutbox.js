const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');

exports.putWorkItemInUsersOutbox = async ({
  userId,
  section,
  workItem,
  applicationContext,
}) => {
  await createUserOutboxRecord({
    applicationContext,
    userId,
    workItem: {
      ...workItem,
    },
  });
  await createSectionOutboxRecord({
    applicationContext,
    section,
    workItem: {
      ...workItem,
    },
  });
};
