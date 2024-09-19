import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  Message,
  RawMessage,
} from '../../../../../shared/src/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ReplyMessageType } from '@web-api/business/useCases/messages/createMessageInteractor';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createMessage } from '@web-api/persistence/postgres/messages/createMessage';
import { markMessageThreadRepliedTo } from '@web-api/persistence/postgres/messages/markMessageThreadRepliedTo';

export const replyToMessage = async (
  applicationContext: ServerApplicationContext,
  {
    attachments,
    docketNumber,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: ReplyMessageType,
  authorizedUser: UnknownAuthUser,
): Promise<RawMessage> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await markMessageThreadRepliedTo({
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

  const validatedRawMessage = new Message({
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
  })
    .validate()
    .toRawObject();

  await createMessage({
    message: validatedRawMessage,
  });

  return validatedRawMessage;
};

export const replyToMessageInteractor = (
  applicationContext: ServerApplicationContext,
  {
    attachments,
    docketNumber,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: ReplyMessageType,
  authorizedUser: UnknownAuthUser,
): Promise<RawMessage> => {
  return replyToMessage(
    applicationContext,
    {
      attachments,
      docketNumber,
      message,
      parentMessageId,
      subject,
      toSection,
      toUserId,
    },
    authorizedUser,
  );
};
