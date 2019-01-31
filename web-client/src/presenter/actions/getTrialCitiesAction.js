export default async ({ applicationContext, path, props }) => {
  const useCases = applicationContext.getUseCases();
  const trialCities = await useCases.getTrialCities({
    procedureType: props.value,
    applicationContext: applicationContext,
  });
  if (trialCities) {
    return path.success({ trialCities });
  } else {
    return path.error({
      alertError: {
        title: 'Problem retrieving trial cities',
        message: 'There was an error retrieving the trial cities.',
      },
    });
  }
};
