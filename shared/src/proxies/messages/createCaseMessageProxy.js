const { post } = require('../requests');

/**
 * createCaseMessageInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {string} providers.from the name of the user sending the message
 * @param {string} providers.fromSection the section of the user sending the message
 * @param {string} providers.fromUserId the user id of the user sending the message
 * @param {string} providers.message the message text
 * @param {string} providers.subject the message subject
 * @param {string} providers.to the name of the user receiving the message
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {Promise<*>} the promise of the api call
 */
exports.createCaseMessageInteractor = ({
  applicationContext,
  caseId,
  from,
  fromSection,
  fromUserId,
  message,
  subject,
  to,
  toSection,
  toUserId,
}) => {
  return post({
    applicationContext,
    body: {
      from,
      fromSection,
      fromUserId,
      message,
      subject,
      to,
      toSection,
      toUserId,
    },
    endpoint: `/messages/${caseId}`,
  });
};
