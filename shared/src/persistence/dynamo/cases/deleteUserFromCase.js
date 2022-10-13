const client = require('../../dynamodbClientService');

/**
 * deleteUserFromCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to delete the mapping records for
 * @param {string} providers.userId the id of the user to delete from the case
 * @returns {Promise} the return from the persistence delete calls
 */
exports.deleteUserFromCase = ({ applicationContext, docketNumber, userId }) =>
  client.remove({
    applicationContext,
    key: {
      pk: `user|${userId}`,
      sk: `case|${docketNumber}`,
    },
  });
