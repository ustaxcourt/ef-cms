const { get } = require('../../dynamodbClientService');

/**
 * getCaseMessageById
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case message data
 * @returns {object} the created case message
 */
exports.getCaseMessageById = async ({
  applicationContext,
  caseId,
  messageId,
}) => {
  return get({
    Key: {
      pk: `case|${caseId}`,
      sk: `message|${messageId}`,
    },
    applicationContext,
  });
};
