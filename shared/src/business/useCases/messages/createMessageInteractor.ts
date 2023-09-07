import { Case } from '../../entities/cases/Case';
import { Message } from '../../entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

export const createMessageInteractor = async (
  applicationContext: IApplicationContext,
  {
    attachments,
    docketNumber,
    draftAttachments,
    message,
    subject,
    toSection,
    toUserId,
  }: {
    attachments: any;
    docketNumber: string;
    draftAttachments: any;
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

  attachments = [...attachments, ...draftAttachments];

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
