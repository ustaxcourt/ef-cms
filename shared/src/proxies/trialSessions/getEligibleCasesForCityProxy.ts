import { get } from '../requests';

export const getEligibleCasesForCityInteractor = (
  applicationContext,
  { trialCity },
) => {
  return get({
    applicationContext,
    endpoint: `/cases/${trialCity}/eligible-cases`,
  });
};
