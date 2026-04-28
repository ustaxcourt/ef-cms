import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getUsersPendingEmailInteractor = (
  applicationContext: ClientApplicationContext,
  { userIds },
) => {
  return get({
    applicationContext,
    endpoint: `/users/pending-email?userIds=${userIds.join(',')}`,
  });
};
