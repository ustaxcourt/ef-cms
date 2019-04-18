const client = require('../../dynamodbClientService');

exports.putWorkItemInOutbox = async ({ workItem, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  const createdAt = new Date().toISOString();
  await client.put({
    Item: {
      pk: `${user.userId}|outbox`,
      sk: createdAt,
      ...workItem,
    },
    applicationContext,
  });
  await client.put({
    Item: {
      pk: `${user.section}|outbox`,
      sk: createdAt,
      ...workItem,
    },
    applicationContext,
  });
};
