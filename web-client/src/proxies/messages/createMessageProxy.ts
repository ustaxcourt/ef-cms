import { ClientApplicationContext } from '@web-client/applicationContext';
import { MessageWithMetaData } from '@web-api/business/useCases/messages/createMessageInteractor';
import { post } from '../requests';
import { RawMessage } from '@shared/business/entities/Message';

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
): Promise<RawMessage> => {
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
