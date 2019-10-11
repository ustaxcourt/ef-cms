const client = require('../../dynamodbClientService');

/**
 * updateUserOnCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update the mapping records for
 * @param {string} providers.userToUpdate the user record to update
 * @returns {Promise} the return from the persistence put call
 */
exports.updateUserOnCase = async ({
  applicationContext,
  caseId,
  userToUpdate,
}) => {
  return await client.put({
    Item: {
      pk: `${userToUpdate.userId}|case`,
      sk: caseId,
      ...userToUpdate,
    },
    applicationContext,
  });
};
