import { RawUser } from '@shared/business/entities/User';
import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { RawPractitioner } from '@shared/business/entities/Practitioner';

export const updateUserPendingEmailInteractor = (
  applicationContext: ClientApplicationContext,
  { pendingEmail },
): Promise<RawUser | RawPractitioner> => {
  return put({
    applicationContext,
    body: {
      pendingEmail,
    },
    endpoint: '/users/pending-email',
  });
};
