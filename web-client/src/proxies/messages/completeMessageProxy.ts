import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const completeMessageInteractor = (
  applicationContext: ClientApplicationContext,
  {
    completedByUserId,
    messages,
  }: {
    completedByUserId?: string;
    messages: { messageBody: string; parentMessageId: string }[];
  },
): Promise<void> => {
  const { parentMessageId } = messages[0];
  return post({
    applicationContext,
    body: {
      completedByUserId,
      messages,
    },
    endpoint: `/messages/${parentMessageId}/complete`,
  });
};
