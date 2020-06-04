const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseMessage } = require('../../entities/CaseMessage');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * creates a message on a case
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
 * @returns {object} the created message
 */
exports.createCaseMessageInteractor = async ({
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
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseMessage = new CaseMessage(
    {
      caseId,
      from,
      fromSection,
      fromUserId,
      message,
      subject,
      to,
      toSection,
      toUserId,
    },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  //TODO call persistence

  return caseMessage;
};
