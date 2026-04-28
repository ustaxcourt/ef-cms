import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getOutboxMessagesForSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/outbox/section/${section}`,
  });
};
