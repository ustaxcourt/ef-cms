import { replyToMessage } from './replyToMessageInteractor';

export const forwardMessageInteractor = async (
  applicationContext,
  {
    attachments,
    docketNumber,
    draftAttachments,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: {
    attachments: any;
    docketNumber: string;
    draftAttachments: any;
    message: string;
    parentMessageId: string;
    subject: string;
    toSection: string;
    toUserId: string;
  },
) => {
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
