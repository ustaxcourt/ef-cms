const client = require('../../dynamodbClientService');

/**
 * deleteUserCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case the notes are associated with
 * @param {string} providers.userId the id of the user who owns the case notes
 * @returns {Array<Promise>} the promises for the persistence delete calls
 */
exports.deleteUserCaseNote = async ({
  applicationContext,
  docketNumber,
  userId,
}) => {
  return await client.delete({
    applicationContext,
    key: {
      pk: `user-case-note|${docketNumber}`,
      sk: `user|${userId}`,
    },
  });
};
