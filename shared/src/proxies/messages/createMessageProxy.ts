import { ClientApplicationContext } from '@web-client/applicationContext';
import { MessageWithMetaData } from '@web-api/business/useCases/messages/createMessageInteractor';
import { post } from '../requests';

export const createMessageInteractor = (
  applicationContext: ClientApplicationContext,
  {
    attachments,
    docketNumber,
    message,
    subject,
    toSection,
    toUserId,
  }: MessageWithMetaData,
) => {
  return post({
    applicationContext,
    body: {
      attachments,
      docketNumber,
      message,
      subject,
      toSection,
      toUserId,
    },
    endpoint: '/messages/',
  });
};
