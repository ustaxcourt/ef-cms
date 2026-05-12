import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { RawPractitioner } from '@shared/business/entities/Practitioner';

export const updatePractitionerUserInteractor = (
  applicationContext: ClientApplicationContext,
  {
    barNumber,
    user,
    clientConnectionId,
  }: { barNumber: string; user: RawPractitioner; clientConnectionId: string },
): Promise<void> => {
  return put({
    applicationContext,
    body: { user, clientConnectionId },
    endpoint: `/async/practitioners/${barNumber}`,
  });
};
