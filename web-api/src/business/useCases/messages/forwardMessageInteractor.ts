import { RawMessage } from '@shared/business/entities/Message';
import { ReplyMessageType } from '@web-api/business/useCases/messages/createMessageInteractor';
import { replyToMessage } from './replyToMessageInteractor';

export const forwardMessageInteractor = async (
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
  return await replyToMessage(applicationContext, {
    attachments,
    docketNumber,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  });
};
