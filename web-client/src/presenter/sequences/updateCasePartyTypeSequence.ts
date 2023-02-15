import { resetContactsAction } from '../actions/resetContactsAction';
import { setPartyTypeAction } from '../actions/setPartyTypeAction';

/**
 * set state.form.partyType to the passed
 * in props.value, and call the resetContactsAction
 * to clear the contacts
 */
export const updateCasePartyTypeSequence = [
  setPartyTypeAction,
  resetContactsAction,
];
