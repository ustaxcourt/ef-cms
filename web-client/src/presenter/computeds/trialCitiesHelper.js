import { state } from 'cerebral';

export const trialCitiesHelper = get => {
  const trialCities = get(state.trialCities) || [];
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
