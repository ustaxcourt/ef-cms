import { state } from 'cerebral';

/**
 * gets the trial cities based on procedureType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.constants
 * @param {String} procedureType
 * @returns {Object} trialCities, trialCitiesByState
 */
export const trialCitiesHelper = get => procedureType => {
  const { TRIAL_CITIES } = get(state.constants);
  const trialCities =
    procedureType === 'Small' ? TRIAL_CITIES.SMALL : TRIAL_CITIES.REGULAR;
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
    trialCities: state.trialCities || [],
    trialCitiesByState: states,
  };
};
