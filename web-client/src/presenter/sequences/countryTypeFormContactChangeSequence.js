import { clearAlertsAction } from '../actions/clearAlertsAction';
import { countryTypeFormContactChangeAction } from '../actions/countryTypeFormContactChangeAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const countryTypeFormContactChangeSequence = [
  countryTypeFormContactChangeAction,
  stopShowValidationAction,
  setFormValueAction,
  clearAlertsAction,
];
