const client = require('../../dynamodbClientService');
const { getCaseIdFromDocketNumber } = require('./getCaseIdFromDocketNumber');

/**
 * deleteUserFromCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to delete the mapping records for
 * @param {string} providers.userId the id of the user to delete from the case
 * @returns {Promise} the return from the persistence delete calls
 */
exports.deleteUserFromCase = async ({
  applicationContext,
  docketNumber,
  userId,
}) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber,
  });

  return client.delete({
    applicationContext,
    key: {
      pk: `user|${userId}`,
      sk: `case|${caseId}`,
    },
  });
};
