import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCompletedMessagesForSectionInteractor = (
  applicationContext: ClientApplicationContext,
  { section },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/completed/section/${section}`,
  });
};
