import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const setMessageAsReadInteractor = (
  applicationContext: ClientApplicationContext,
  { messageId },
): Promise<void> => {
  return post({
    applicationContext,
    endpoint: `/messages/${messageId}/read`,
  });
};
