const { post } = require('../requests');

/**
 * createCaseMessageInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {string} providers.message the message text
 * @param {string} providers.subject the message subject
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {Promise<*>} the promise of the api call
 */
exports.createCaseMessageInteractor = ({
  applicationContext,
  attachments,
  caseId,
  message,
  subject,
  toSection,
  toUserId,
}) => {
  return post({
    applicationContext,
    body: {
      attachments,
      caseId,
      message,
      subject,
      toSection,
      toUserId,
    },
    endpoint: '/messages/',
  });
};
