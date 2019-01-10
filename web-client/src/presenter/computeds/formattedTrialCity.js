import { state } from 'cerebral';

export const getTrialCityName = get => trialCity => {
  return trialCity.city + ', ' + trialCity.state;
};
