const { post } = require('../requests');

/**
 * forwardMessageInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array} providers.attachments array attachments on the message
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.message the message text
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @param {string} providers.subject the message subject
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {Promise<*>} the promise of the api call
 */
exports.forwardMessageInteractor = (
  applicationContext,
  {
    attachments,
    docketNumber,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  },
) => {
  return post({
    applicationContext,
    body: {
      attachments,
      docketNumber,
      message,
      subject,
      toSection,
      toUserId,
    },
    endpoint: `/messages/${parentMessageId}/forward`,
  });
};
