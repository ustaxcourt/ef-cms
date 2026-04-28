import { head } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPublicCaseExistsInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return head({
    applicationContext,
    endpoint: `/public-api/cases/${docketNumber}`,
    params: undefined,
  });
};
