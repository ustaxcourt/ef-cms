const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { CaseMessage } = require('../../entities/CaseMessage');
const { UnauthorizedError } = require('../../../errors/errors');

const replyToMessage = async ({
  applicationContext,
  attachments,
  docketNumber,
  message,
  parentMessageId,
  subject,
  toSection,
  toUserId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext
    .getPersistenceGateway()
    .markCaseMessageThreadRepliedTo({
      applicationContext,
      parentMessageId,
    });

  const {
    caseCaption,
    docketNumberWithSuffix,
    status,
  } = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const fromUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const toUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: toUserId });

  const caseMessage = new CaseMessage(
    {
      attachments,
      caseStatus: status,
      caseTitle: Case.getCaseTitle(caseCaption),
      docketNumber,
      docketNumberWithSuffix,
      from: fromUser.name,
      fromSection: fromUser.section,
      fromUserId: fromUser.userId,
      message,
      parentMessageId,
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

exports.replyToMessage = replyToMessage;

/**
 * replies to a case message
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
exports.replyToCaseMessageInteractor = async ({
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
