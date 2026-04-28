import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getOutboxMessagesForUserInteractor = (
  applicationContext: ClientApplicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/outbox/${userId}`,
  });
};
