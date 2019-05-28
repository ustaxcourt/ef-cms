import { sortBy } from 'lodash';
import { state } from 'cerebral';

/**
 * gets the trial cities based on procedureType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.constants
 * @returns {Object} trialCitiesByState
 */
export const trialCitiesHelper = get => procedureType => {
  const { TRIAL_CITIES } = get(state.constants);
  let trialCities =
    procedureType === 'Small' ? TRIAL_CITIES.SMALL : TRIAL_CITIES.REGULAR;
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
