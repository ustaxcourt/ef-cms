const client = require('../../dynamodbClientService');

/**
 * getUserById
 *
 * @param {string} userId the id of the user
 * @returns {*} result returned from persistence
 */
exports.getUserById = async ({ applicationContext, userId }) => {
  return client.get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
};
