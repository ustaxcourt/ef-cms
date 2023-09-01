import { post } from '../requests';

export const replyToMessageInteractor = (
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
  },
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
    endpoint: `/messages/${parentMessageId}/reply`,
  });
};
