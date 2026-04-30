import { head } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseExistsInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<boolean> => {
  return head({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
  });
};
