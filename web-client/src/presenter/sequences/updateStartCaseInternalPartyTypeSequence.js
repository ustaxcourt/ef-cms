import { resetContactsAction } from '../actions/StartCaseInternal/resetContactsAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { updateOrderForOdsAction } from '../actions/StartCaseInternal/updateOrderForOdsAction';

/**
 * set state.form.partyType to the passed
 * in props.value, and call the resetContactsAction
 * to clear the contacts
 */
export const updateStartCaseInternalPartyTypeSequence = [
  setFormValueAction,
  updateOrderForOdsAction,
  resetContactsAction,
];
