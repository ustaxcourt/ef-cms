import { clearAlertsAction } from '../actions/clearAlertsAction';
import { contactSecondaryCountryTypeChangeAction } from '../actions/contactSecondaryCountryTypeChangeAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const contactSecondaryCountryTypeChangeSequence = [
  contactSecondaryCountryTypeChangeAction,
  stopShowValidationAction,
  setFormValueAction,
  clearAlertsAction,
];
