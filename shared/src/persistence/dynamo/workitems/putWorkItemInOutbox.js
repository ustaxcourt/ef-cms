const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');

exports.putWorkItemInOutbox = async ({ workItem, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  const createdAt = new Date().toISOString();
  await createUserOutboxRecord({
    applicationContext,
    userId: user.userId,
    workItem: {
      ...workItem,
      createdAt,
    },
  });
  await createSectionOutboxRecord({
    applicationContext,
    section: user.section,
    workItem: {
      ...workItem,
      createdAt,
    },
  });
};
