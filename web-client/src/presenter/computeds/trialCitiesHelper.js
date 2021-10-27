import { sortBy } from 'lodash';

/**
 * gets the trial cities based on procedureType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.constants
 * @param {object} applicationContext the application context
 * @returns {object} trialCitiesByState
 */
export const trialCitiesHelper = (get, applicationContext) => procedureType => {
  const { TRIAL_CITIES } = applicationContext.getConstants();
  const standaloneRemote = 'Standalone Remote';
  let trialCities;
  switch (procedureType) {
    case 'Small':
      trialCities = TRIAL_CITIES.SMALL;
      break;
    case 'All':
      trialCities = TRIAL_CITIES.ALL;
      break;
    case 'Regular': //fall-through
    default:
      trialCities = TRIAL_CITIES.REGULAR;
      break;
  }

  trialCities = sortBy(trialCities, ['state', 'city']).sort(trialCity => {
    if (trialCity.state === standaloneRemote) {
      return -1;
    }
    return 0;
  });

  const getTrialCityName = trialLocation =>
    `${trialLocation.city}, ${trialLocation.state}`;
  const states = {};
  trialCities.forEach(
    trialLocation =>
      (states[trialLocation.state] = [
        ...(states[trialLocation.state] || []),
        trialLocation.city === standaloneRemote
          ? standaloneRemote
          : getTrialCityName(trialLocation),
      ]),
  );

  return {
    trialCitiesByState: states,
  };
};
