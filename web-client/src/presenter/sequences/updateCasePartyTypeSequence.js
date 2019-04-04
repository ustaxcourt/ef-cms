import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

import { resetContactsAction } from '../actions/resetContactsAction';

/**
 * set state.caseDetail.partyType to the passed
 * in props.value, and call the resetContactsAction
 * to clear the contacts
 */
export const updateCasePartyTypeSequence = [
  set(state.caseDetail.partyType, props.value),
  resetContactsAction,
];
