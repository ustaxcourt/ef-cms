import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPublicCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/public-api/cases/${docketNumber}`,
  });
};
