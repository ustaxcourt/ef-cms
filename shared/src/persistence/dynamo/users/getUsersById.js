const { batchGet } = require('../../dynamodbClientService');
const { uniq } = require('lodash');

/**
 * getUsersById
 *
 * @param {array} userIds an array of userIds (string) for a user
 * @returns {*} result returned from persistence
 */
exports.getUsersById = ({ applicationContext, userIds }) =>
  batchGet({
    applicationContext,
    keys: uniq(userIds).map(userId => ({
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    })),
  });
