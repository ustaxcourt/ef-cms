import { clearAlertsAction } from '../actions/clearAlertsAction';
import { countryTypeUserContactChangeAction } from '../actions/countryTypeUserContactChangeAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const countryTypeUserContactChangeSequence = [
  countryTypeUserContactChangeAction,
  stopShowValidationAction,
  set(state.user[props.key], props.value),
  clearAlertsAction,
];
