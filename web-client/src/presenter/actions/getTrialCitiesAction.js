export default async ({ applicationContext, props }) => {
  const useCases = applicationContext.getUseCases();
  const trialCities = await useCases.getTrialCities({
    procedureType: props.value,
    applicationContext: applicationContext,
  });
  return { trialCities };
};
