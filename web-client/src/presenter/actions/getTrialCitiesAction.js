export default async ({ applicationContext, props }) => {
  const trialCities = await applicationContext.getUseCases().getTrialCities({
    procedureType: props.value,
    applicationContext: applicationContext,
  });
  return { trialCities };
};
