import { head } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseExistsInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return head({
    applicationContext,
    endpoint: `/cases/${docketNumber}`,
  });
};
