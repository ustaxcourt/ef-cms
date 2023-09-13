import { ReplyMessageType } from '@shared/business/useCases/messages/createMessageInteractor';
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
  }: ReplyMessageType,
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
