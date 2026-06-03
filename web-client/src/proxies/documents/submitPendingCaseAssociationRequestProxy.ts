import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const submitPendingCaseAssociationRequestInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
): Promise<void> => {
  return put({
    applicationContext,
    endpoint: `/users/${userId}/case/${docketNumber}/pending`,
  });
};
