import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { updatePartyTypeAction } from '../actions/StartCase/updatePartyTypeAction';

export const updateStartCaseFormValueSequence = [
  set(state.form[props.key], props.value),
  updatePartyTypeAction,
];
