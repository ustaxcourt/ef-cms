const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');

exports.putWorkItemInOutbox = async ({ applicationContext, workItem }) => {
  const user = applicationContext.getCurrentUser();
  await createUserOutboxRecord({
    applicationContext,
    userId: user.userId,
    workItem: {
      ...workItem,
    },
  });
  await createSectionOutboxRecord({
    applicationContext,
    section: user.section,
    workItem: {
      ...workItem,
    },
  });
};
