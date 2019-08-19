const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');
const { get } = require('../../dynamodbClientService');

exports.putWorkItemInOutbox = async ({ applicationContext, workItem }) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const user = await get({
    Key: {
      pk: authorizedUser.userId,
      sk: authorizedUser.userId,
    },
    applicationContext,
  });

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
