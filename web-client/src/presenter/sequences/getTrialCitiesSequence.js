import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

import { getTrialCitiesAction } from '../actions/getTrialCitiesAction';
import { setTrialCitiesAction } from '../actions/setTrialCitiesAction';

export const getTrialCitiesSequence = [
  set(state.form.procedureType, props.value),
  set(state.form.preferredTrialCity, ''),
  getTrialCitiesAction,
  setTrialCitiesAction,
];
