import { clearAlertsAction } from '../actions/clearAlertsAction';
import { countryTypeUserContactChangeAction } from '../actions/countryTypeUserContactChangeAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const countryTypeUserContactChangeSequence = [
  countryTypeUserContactChangeAction,
  stopShowValidationAction,
  setFormValueAction,
  clearAlertsAction,
];
