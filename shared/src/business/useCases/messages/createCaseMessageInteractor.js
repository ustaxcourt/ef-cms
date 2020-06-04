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
 * @param {string} providers.message the message text
 * @param {string} providers.subject the message subject
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {object} the created message
 */
exports.createCaseMessageInteractor = async ({
  applicationContext,
  caseId,
  message,
  subject,
  toSection,
  toUserId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // TODO: Would it be better to just pass this in since case detail is already loaded in the action?
  const {
    docketNumber,
    docketNumberSuffix,
    status,
  } = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const fromUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const toUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: toUserId });

  const caseMessage = new CaseMessage(
    {
      caseId,
      caseStatus: status,
      docketNumber,
      docketNumberSuffix,
      from: fromUser.name,
      fromSection: fromUser.section,
      fromUserId: fromUser.userId,
      message,
      subject,
      to: toUser.name,
      toSection,
      toUserId,
    },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().createCaseMessage({
    applicationContext,
    caseMessage,
  });

  return caseMessage;
};
