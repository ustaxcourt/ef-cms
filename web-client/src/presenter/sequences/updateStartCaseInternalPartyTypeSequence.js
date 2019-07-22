import { props, state } from 'cerebral';
import { resetContactsAction } from '../actions/StartCaseInternal/resetContactsAction';
import { set } from 'cerebral/factories';

/**
 * set state.form.partyType to the passed
 * in props.value, and call the resetContactsAction
 * to clear the contacts
 */
export const updateStartCaseInternalPartyTypeSequence = [
  set(state.form.partyType, props.value),
  resetContactsAction,
];
