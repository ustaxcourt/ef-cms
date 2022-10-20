const { get } = require('../../dynamodbClientService');

/**
 * getMessageById
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the message
 * @param {string} providers.messageId the id of the message
 * @returns {object} the message
 */
exports.getMessageById = ({ applicationContext, docketNumber, messageId }) =>
  get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `message|${messageId}`,
    },
    applicationContext,
  });
