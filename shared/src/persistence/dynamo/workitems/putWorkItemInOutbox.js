const client = require('../../dynamodbClientService');

exports.putWorkItemInOutbox = async ({ workItem, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  const createdAt = new Date().toISOString();

  await client.put({
    applicationContext,
    Item: {
      pk: `${user.userId}|outbox`,
      sk: createdAt,
      ...workItem,
    },
  });
  await client.put({
    applicationContext,
    Item: {
      pk: `${user.section}|outbox`,
      sk: createdAt,
      ...workItem,
    },
  });
};
