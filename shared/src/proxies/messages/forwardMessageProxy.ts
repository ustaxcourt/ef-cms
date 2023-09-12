import { MessageWithAParentType } from '@shared/business/useCases/messages/replyToMessageInteractor';
import { post } from '../requests';

export const forwardMessageInteractor = (
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
  }: MessageWithAParentType,
) => {
  return post({
    applicationContext,
    body: {
      attachments,
      docketNumber,
      draftAttachments,
      message,
      subject,
      toSection,
      toUserId,
    },
    endpoint: `/messages/${parentMessageId}/forward`,
  });
};
