import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const completeMessageInteractor = (
  applicationContext: ClientApplicationContext,
  {
    messages,
  }: { messages: { messageBody: string; parentMessageId: string }[] },
): Promise<void> => {
  const { parentMessageId } = messages[0];
  return post({
    applicationContext,
    body: {
      messages,
    },
    endpoint: `/messages/${parentMessageId}/complete`,
  });
};
