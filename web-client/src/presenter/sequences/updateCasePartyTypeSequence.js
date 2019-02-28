import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

import { resetContactsAction } from '../actions/resetContactsAction';

export const updateCasePartyTypeSequence = [
  set(state.caseDetail.partyType, props.value),
  resetContactsAction,
];
