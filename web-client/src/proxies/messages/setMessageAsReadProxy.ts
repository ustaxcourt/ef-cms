import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const setMessageAsReadInteractor = (
  applicationContext: ClientApplicationContext,
  { messageId },
) => {
  return post({
    applicationContext,
    endpoint: `/messages/${messageId}/read`,
  });
};
