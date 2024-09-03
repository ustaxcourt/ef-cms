import { RawMessage } from '@shared/business/entities/Message';
import { ReplyMessageType } from '@web-api/business/useCases/messages/createMessageInteractor';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { replyToMessage } from './replyToMessageInteractor';

export const forwardMessageInteractor = async (
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
  return await replyToMessage(
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
