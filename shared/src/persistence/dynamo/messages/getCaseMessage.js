const { get } = require('../../dynamodbClientService');

/**
 * getCaseMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {string} providers.messageId the id of the message
 * @returns {object} the retrieved case message
 */
exports.getCaseMessage = async ({ applicationContext, caseId, messageId }) => {
  return await get({
    Key: {
      pk: `case|${caseId}`,
      sk: `message|${messageId}`,
    },
    applicationContext,
  });
};
