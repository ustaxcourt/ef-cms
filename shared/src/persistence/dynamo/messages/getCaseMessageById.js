const { get } = require('../../dynamodbClientService');

/**
 * getCaseMessageById
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the message id
 * @returns {object} the created case message
 */
exports.getCaseMessageById = async ({ applicationContext, messageId }) => {
  return get({
    Key: {
      pk: `message|${messageId}`,
      sk: `message|${messageId}`,
    },
    applicationContext,
  });
};
