import { Message, RawMessage } from '../../entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { ReplyMessageType } from '@shared/business/useCases/messages/createMessageInteractor';
import { UnauthorizedError } from '@web-api/errors/errors';

export const replyToMessage = async (
  applicationContext: IApplicationContext,
  {
    attachments,
    docketNumber,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: ReplyMessageType,
): Promise<RawMessage> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext.getPersistenceGateway().markMessageThreadRepliedTo({
    applicationContext,
    parentMessageId,
  });

  const caseEntity = await applicationContext
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
    { applicationContext, caseEntity },
  )
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().upsertMessage({
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
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: ReplyMessageType,
): Promise<RawMessage> => {
  return replyToMessage(applicationContext, {
    attachments,
    docketNumber,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  });
};
