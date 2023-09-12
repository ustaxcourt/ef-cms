import { MessageType } from '@shared/business/useCases/messages/createMessageInteractor';
import { post } from '../requests';

export const createMessageInteractor = (
  applicationContext: IApplicationContext,
  {
    attachments,
    docketNumber,
    draftAttachments,
    message,
    subject,
    toSection,
    toUserId,
  }: MessageType,
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
