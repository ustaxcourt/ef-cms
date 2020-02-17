import { clearAlertsAction } from '../actions/clearAlertsAction';
import { props, state } from 'cerebral';
import { resetContactsAction } from '../actions/StartCaseInternal/resetContactsAction';
import { set } from 'cerebral/factories';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

/**
 * set state.form.partyType to the passed
 * in props.value, and call the resetContactsAction
 * to clear the contacts
 */
export const updateFormPartyTypeSequence = [
  set(state.form.partyType, props.value),
  clearAlertsAction,
  stopShowValidationAction,
  resetContactsAction,
];
