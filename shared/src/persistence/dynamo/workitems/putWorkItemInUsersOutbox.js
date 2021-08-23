const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');

exports.putWorkItemInUsersOutbox = async ({
  applicationContext,
  section,
  userId,
  workItem,
}) => {
  await Promise.all([
    createUserOutboxRecord({
      applicationContext,
      userId,
      workItem,
    }),
    createSectionOutboxRecord({
      applicationContext,
      section,
      workItem,
    }),
  ]);
};
