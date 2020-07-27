const { replyToMessage } = require('./replyToCaseMessageInteractor');

/**
 * forwards a case message
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {array} providers.attachments array of objects containing documentId and documentTitle
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.message the message text
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @param {string} providers.subject the message subject
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {object} the case message
 */
exports.forwardCaseMessageInteractor = async ({
  applicationContext,
  attachments,
  docketNumber,
  message,
  parentMessageId,
  subject,
  toSection,
  toUserId,
}) => {
  return await replyToMessage({
    applicationContext,
    attachments,
    docketNumber,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  });
};
