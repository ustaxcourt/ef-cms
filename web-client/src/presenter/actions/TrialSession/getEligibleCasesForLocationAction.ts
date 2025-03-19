export const getEligibleCasesForLocationAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { trialLocation } = props;
  //TODO: consider renaming trialCity -> trialLocation on backend?

  const eligibleCases = await applicationContext
    .getUseCases()
    .getEligibleCasesForCityInteractor(applicationContext, {
      trialCity: trialLocation,
    });

  return { eligibleCases };
};
