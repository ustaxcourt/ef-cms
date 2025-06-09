import { getEligibleCasesForCityInteractor } from '@shared/proxies/trialSessions/getEligibleCasesForCityProxy';

export const getEligibleCasesForLocationAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { trialLocation } = props;

  const eligibleCases = await getEligibleCasesForCityInteractor(applicationContext, {
      trialCity: trialLocation,
    });

  return { eligibleCases };
};
