import { clearAlertsAction } from '../actions/clearAlertsAction';
import { countryTypeChangeAction } from '../actions/countryTypeChangeAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateCaseValueAction } from '../actions/updateCaseValueAction';

export const countryTypeChangeSequence = [
  countryTypeChangeAction,
  stopShowValidationAction,
  updateCaseValueAction,
  clearAlertsAction,
];
