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
      pk: `connections-${userId}`,
      sk: connectionId,
    },
    applicationContext,
  });
};
