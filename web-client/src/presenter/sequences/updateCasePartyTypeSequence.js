import { props, state } from 'cerebral';
import { resetContactsAction } from '../actions/resetContactsAction';
import { set } from 'cerebral/factories';

/**
 * set state.caseDetail.partyType to the passed
 * in props.value, and call the resetContactsAction
 * to clear the contacts
 */
export const updateCasePartyTypeSequence = [
  set(state.caseDetail.partyType, props.value),
  resetContactsAction,
];
