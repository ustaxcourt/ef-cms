import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getEligibleCasesForCityInteractor = (
  applicationContext: ClientApplicationContext,
  { trialCity },
) => {
  return get({
    applicationContext,
    endpoint: `/cases/${trialCity}/eligible-cases`,
  });
};
