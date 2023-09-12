import {
  MessageWithAParentType,
  replyToMessage,
} from './replyToMessageInteractor';

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
  }: MessageWithAParentType,
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
