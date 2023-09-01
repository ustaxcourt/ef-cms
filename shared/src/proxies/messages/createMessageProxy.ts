import { post } from '../requests';

export const createMessageInteractor = (
  applicationContext,
  {
    attachments,
    docketNumber,
    draftAttachments,
    message,
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
    endpoint: '/messages/',
  });
};
