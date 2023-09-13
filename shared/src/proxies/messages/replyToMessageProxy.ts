import { ClientApplicationContext } from '@web-client/applicationContext';
import { ReplyMessageType } from '@shared/business/useCases/messages/createMessageInteractor';
import { post } from '../requests';

export const replyToMessageInteractor = (
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
    endpoint: `/messages/${parentMessageId}/reply`,
  });
};
