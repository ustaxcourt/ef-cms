import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';
import { updatePartyTypeAction } from '../actions/updatePartyTypeAction';

export const updateStartCaseFormValueSequence = [
  set(state.form[props.key], props.value),
  updatePartyTypeAction,
];
