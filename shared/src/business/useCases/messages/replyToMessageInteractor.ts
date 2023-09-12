import { Case } from '../../entities/cases/Case';
import { Message } from '../../entities/Message';
import { MessageType } from '@shared/business/useCases/messages/createMessageInteractor';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';

export type MessageWithAParentType = MessageType & {
  parentMessageId: string;
};

export const replyToMessage = async (
  applicationContext: IApplicationContext,
  {
    attachments,
    docketNumber,
    draftAttachments,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: MessageWithAParentType,
): Promise<RawMessage> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext.getPersistenceGateway().markMessageThreadRepliedTo({
    applicationContext,
    parentMessageId,
  });

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

  await applicationContext.getPersistenceGateway().createMessage({
    applicationContext,
    message: validatedRawMessage,
  });

  return validatedRawMessage;
};

export const replyToMessageInteractor = (
  applicationContext: IApplicationContext,
  {
    attachments,
    docketNumber,
    draftAttachments,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: MessageWithAParentType,
): Promise<RawMessage> => {
  return replyToMessage(applicationContext, {
    attachments,
    docketNumber,
    draftAttachments,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  });
};
