const { put } = require('../../dynamodbClientService');

/**
 * saveUserConnection
 */
exports.saveUserConnection = async ({
  applicationContext,
  connectionId,
  endpoint,
  userId,
}) => {
  return await put({
    Item: {
      endpoint,
      gsi1pk: connectionId,
      pk: `connections-${userId}`,
      sk: connectionId,
    },
    applicationContext,
  });
};
