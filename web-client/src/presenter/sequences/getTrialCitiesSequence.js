import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

import getTrialCities from '../actions/getTrialCitiesAction';
import setTrialCities from '../actions/setTrialCitiesAction';

export default [
  set(state.form.procedureType, props.value),
  set(state.form.preferredTrialCity, ''),
  getTrialCities,
  setTrialCities,
];
