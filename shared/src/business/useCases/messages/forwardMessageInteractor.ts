import { ReplyMessageType } from '@shared/business/useCases/messages/createMessageInteractor';
import { replyToMessage } from './replyToMessageInteractor';

export const forwardMessageInteractor = async (
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
  }: ReplyMessageType,
): Promise<RawMessage> => {
  return await replyToMessage(applicationContext, {
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
