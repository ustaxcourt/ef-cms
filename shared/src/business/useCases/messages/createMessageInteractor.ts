import { Case } from '../../entities/cases/Case';
import { Message } from '../../entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';

/**
 * creates a message on a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array} providers.attachments array of objects containing documentId and documentTitle
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.message the message text
 * @param {string} providers.subject the message subject
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {object} the created message
 */
export const createMessageInteractor = async (
  applicationContext: IApplicationContext,
  {
    attachments,
    docketNumber,
    message,
    subject,
    toSection,
    toUserId,
  }: {
    attachments: any;
    docketNumber: string;
    message: string;
    subject: string;
    toSection: string;
    toUserId: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseCaption, docketNumberWithSuffix, status } =
    await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({ applicationContext, docketNumber });

  const fromUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const toUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: toUserId });

  const validatedRawMessage = new Message(
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
      subject,
      to: toUser.name,
      toSection,
      toUserId,
    },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().createMessage({
    applicationContext,
    message: validatedRawMessage,
  });

  return validatedRawMessage;
};
