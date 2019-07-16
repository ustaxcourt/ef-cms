import { clearAlertsAction } from '../actions/clearAlertsAction';
import { countryTypeChangeAction } from '../actions/countryTypeChangeAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const countryTypeChangeSequence = [
  countryTypeChangeAction,
  stopShowValidationAction,
  set(state.caseDetail[props.key], props.value),
  clearAlertsAction,
];
