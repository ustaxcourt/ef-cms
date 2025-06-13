import { Case } from '@shared/business/entities/cases/Case';
import { Message, RawMessage } from '@shared/business/entities/Message';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ReplyMessageType } from '@web-api/business/useCases/messages/createMessageInteractor';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createMessageAsReply } from '@web-api/persistence/postgres/messages/createMessageAsReply';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

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

  const [fromUser, toUser] = await Promise.all([
    getUserById({ userId: authorizedUser.userId }),
    getUserById({ userId: toUserId }),
  ]);
  if (!fromUser) {
    throw new NotFoundError(
      `Unable to find user with userId ${authorizedUser.userId}`,
    );
  }
  if (!toUser) {
    throw new NotFoundError(`Unable to find user with userId ${toUserId}`);
  }

  const associatedCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  if (!associatedCase) {
    throw new NotFoundError(`Case ${docketNumber} not found`);
  }

  const { caseCaption, docketNumberWithSuffix, status } = associatedCase;

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

  await createMessageAsReply({
    newMessage: validatedRawMessage,
    parentMessageId,
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
