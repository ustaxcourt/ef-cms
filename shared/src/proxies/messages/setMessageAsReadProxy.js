const { post } = require('../requests');

/**
 * setMessageAsReadInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number for the case the message is associated with
 * @param {string} providers.messageId the id of the message to set as read
 * @returns {Promise<*>} the promise of the api call
 */
exports.setMessageAsReadInteractor = ({
  applicationContext,
  docketNumber,
  messageId,
}) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
    },
    endpoint: `/messages/${messageId}/read`,
  });
};
