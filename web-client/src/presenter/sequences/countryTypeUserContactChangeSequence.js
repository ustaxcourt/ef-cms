import { clearAlertsAction } from '../actions/clearAlertsAction';
import { countryTypeUserContactChangeAction } from '../actions/countryTypeUserContactChangeAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateUserPropertyAction } from '../actions/updateUserPropertyAction';

export const countryTypeUserContactChangeSequence = [
  countryTypeUserContactChangeAction,
  stopShowValidationAction,
  updateUserPropertyAction,
  clearAlertsAction,
];
