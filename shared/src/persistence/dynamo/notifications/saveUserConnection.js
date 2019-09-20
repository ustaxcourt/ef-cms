const { put } = require('../../dynamodbClientService');

/**
 * saveUserConnection
 */
exports.saveUserConnection = async ({
  applicationContext,
  connectionId,
  userId,
}) => {
  return await put({
    Item: {
      gsi1pk: connectionId,
      pk: `connections-${userId}`,
      sk: connectionId,
    },
    applicationContext,
  });
};
