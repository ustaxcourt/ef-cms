import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getInboxMessagesForSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/inbox/section/${section}`,
  });
};
