/**
 * gets the trial cities for the specified procedureType pass in as props.value
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the getTrialCities use case
 * @param {Object} providers.props the cerebral props object which contains props.value
 * @returns {Object} a list of trial cities
 */
export const getTrialCitiesAction = async ({ applicationContext, props }) => {
  const trialCities = await applicationContext.getUseCases().getTrialCities({
    procedureType: props.value,
    applicationContext: applicationContext,
  });
  return { trialCities };
};
