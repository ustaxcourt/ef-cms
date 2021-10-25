const { createSectionOutboxRecords } = require('./createSectionOutboxRecords');
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
    createSectionOutboxRecords({
      applicationContext,
      section,
      workItem,
    }),
  ]);
};
