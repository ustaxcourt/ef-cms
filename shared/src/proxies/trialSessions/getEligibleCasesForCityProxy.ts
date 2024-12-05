import { get } from '../requests';

export const getEligibleCasesForCityInteractor = (
  applicationContext,
  { trialCity },
) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialCity}/eligible-cases`,
  });
};
