import { resetContactsAction } from '../actions/resetContactsAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { updateOrderForCdsAction } from '../actions/StartCaseInternal/updateOrderForCdsAction';

/**
 * set state.form.partyType to the passed
 * in props.value, and call the resetContactsAction
 * to clear the contacts
 */
export const updateStartCaseInternalPartyTypeSequence = [
  setFormValueAction,
  updateOrderForCdsAction,
  resetContactsAction,
];
