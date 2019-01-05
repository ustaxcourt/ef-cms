import getTrialCities from '../actions/getTrialCitiesAction';
import setAlertError from '../actions/setAlertErrorAction';
import setTrialCities from '../actions/setTrialCitiesAction';

export default [
  getTrialCities,
  {
    error: [setAlertError],
    success: [setTrialCities],
  },
];
