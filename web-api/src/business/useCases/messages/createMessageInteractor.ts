import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  Message,
  RawMessage,
} from '../../../../../shared/src/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { createMessage } from '@web-api/persistence/postgres/messages/createMessage';

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
  applicationContext: ServerApplicationContext,
  {
    attachments,
    docketNumber,
    message,
    subject,
    toSection,
    toUserId,
  }: MessageWithMetaData,
): Promise<RawMessage> => {
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

  console.log('*** validatedRawMessage', validatedRawMessage);

  await createMessage({ message: validatedRawMessage });

  return validatedRawMessage;
};
