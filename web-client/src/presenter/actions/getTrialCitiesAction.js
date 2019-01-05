import { state } from 'cerebral';

export default async ({ applicationContext, get, path, props }) => {
  const useCases = applicationContext.getUseCases();
  const trialCities = await useCases.getTrialCities({
    userId: get(state.user.userId),
    procedureType: props.procedureType,
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
