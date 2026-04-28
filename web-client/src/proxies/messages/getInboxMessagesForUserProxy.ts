import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getInboxMessagesForUserInteractor = (
  applicationContext: ClientApplicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/inbox/${userId}`,
  });
};
