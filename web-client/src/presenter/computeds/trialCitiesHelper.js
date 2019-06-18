import { sortBy } from 'lodash';
import { state } from 'cerebral';

/**
 * gets the trial cities based on procedureType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.constants
 * @returns {object} trialCitiesByState
 */
export const trialCitiesHelper = get => procedureType => {
  const { TRIAL_CITIES } = get(state.constants);
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
  trialCities = sortBy(trialCities, ['state', 'city']);
  const getTrialCityName = get(state.getTrialCityName);
  const states = {};
  trialCities.forEach(
    trialCity =>
      (states[trialCity.state] = [
        ...(states[trialCity.state] || []),
        getTrialCityName(trialCity),
      ]),
  );

  return {
    trialCitiesByState: states,
  };
};
