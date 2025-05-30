export const getEligibleCasesForLocationAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { trialLocation } = props;

  const eligibleCases = await applicationContext
    .getUseCases()
    .getEligibleCasesForCityInteractor(applicationContext, {
      trialCity: trialLocation,
    });

  return { eligibleCases };
};
