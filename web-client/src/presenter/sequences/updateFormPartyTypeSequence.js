import { clearAlertsAction } from '../actions/clearAlertsAction';
import { resetContactsAction } from '../actions/resetContactsAction';
import { setPartyTypeAction } from '../actions/setPartyTypeAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

/**
 * set state.form.partyType to the passed
 * in props.value, and call the resetContactsAction
 * to clear the contacts
 */
export const updateFormPartyTypeSequence = [
  setPartyTypeAction,
  clearAlertsAction,
  stopShowValidationAction,
  resetContactsAction,
];
