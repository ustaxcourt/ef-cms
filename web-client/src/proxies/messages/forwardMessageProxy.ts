import { ClientApplicationContext } from '@web-client/applicationContext';
import { ReplyMessageType } from '@web-api/business/useCases/messages/createMessageInteractor';
import { post } from '../requests';
import { RawMessage } from '@shared/business/entities/Message';

export const forwardMessageInteractor = (
  applicationContext: ClientApplicationContext,
  {
    attachments,
    docketNumber,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: ReplyMessageType,
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
    endpoint: `/messages/${parentMessageId}/forward`,
  });
};
