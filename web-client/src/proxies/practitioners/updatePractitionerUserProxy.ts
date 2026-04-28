import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updatePractitionerUserInteractor = (
  applicationContext: ClientApplicationContext,
  {
    barNumber,
    user,
    clientConnectionId,
  }: { barNumber: string; user: any; clientConnectionId: string },
) => {
  return put({
    applicationContext,
    body: { user, clientConnectionId },
    endpoint: `/async/practitioners/${barNumber}`,
  });
};
