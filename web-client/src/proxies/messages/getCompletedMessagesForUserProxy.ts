import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCompletedMessagesForUserInteractor = (
  applicationContext: ClientApplicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/completed/${userId}`,
  });
};
