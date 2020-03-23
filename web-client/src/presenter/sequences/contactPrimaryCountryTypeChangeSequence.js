import { clearAlertsAction } from '../actions/clearAlertsAction';
import { contactPrimaryCountryTypeChangeAction } from '../actions/contactPrimaryCountryTypeChangeAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const contactPrimaryCountryTypeChangeSequence = [
  contactPrimaryCountryTypeChangeAction,
  stopShowValidationAction,
  setFormValueAction,
  clearAlertsAction,
];
