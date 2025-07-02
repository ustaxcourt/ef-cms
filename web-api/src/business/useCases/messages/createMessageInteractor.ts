import { Case } from '@shared/business/entities/cases/Case';
import { Message, RawMessage } from '@shared/business/entities/Message';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createMessage } from '@web-api/persistence/postgres/messages/createMessage';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export type MessageType = {
  attachments: {
    documentId: string;
  }[];
  message: string;
  subject: string;
  toSection: string;
  toUserId: string;
};

export type MessageWithMetaData = MessageType & {
  docketNumber: string;
};

export type ReplyMessageType = MessageType & {
  parentMessageId: string;
  docketNumber: string;
};

export const createMessageInteractor = async (
  {
    attachments,
    docketNumber,
    message,
    subject,
    toSection,
    toUserId,
  }: MessageWithMetaData,
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
    docketNumber,
  });

  if (!associatedCase) {
    throw new NotFoundError(`Case ${docketNumber} not found`);
  }

  const { caseCaption, status } = associatedCase;

  const validatedRawMessage = new Message({
    attachments,
    caseStatus: status,
    caseTitle: Case.getCaseTitle(caseCaption),
    docketNumber,
    from: fromUser.name,
    fromSection: fromUser.section,
    fromUserId: fromUser.userId,
    message,
    subject,
    to: toUser.name,
    toSection,
    toUserId,
  })
    .validate()
    .toRawObject();

  await createMessage({ message: validatedRawMessage });

  return validatedRawMessage;
};
