import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const verifyPendingCaseForUserInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
): Promise<boolean> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/case/${docketNumber}/pending`,
  });
};
