const client = require('../../dynamodbClientService');

/**
 * getUserById
 *
 * @param {string} userId the id of the user
 * @returns {*} result returned from persistence
 */
exports.getUserById = ({ applicationContext, userId }) =>
  client.get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
