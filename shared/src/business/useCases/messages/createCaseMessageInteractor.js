const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { CaseMessage } = require('../../entities/CaseMessage');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * creates a message on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {array} providers.attachments array of objects containing documentId and documentTitle
 * @param {string} providers.caseId the id of the case
 * @param {string} providers.message the message text
 * @param {string} providers.subject the message subject
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {object} the created message
 */
exports.createCaseMessageInteractor = async ({
  applicationContext,
  attachments,
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

  const {
    caseCaption,
    docketNumber,
    docketNumberWithSuffix,
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
      attachments,
      caseId,
      caseStatus: status,
      caseTitle: Case.getCaseTitle(caseCaption),
      docketNumber,
      docketNumberWithSuffix,
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
