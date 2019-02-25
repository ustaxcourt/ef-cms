import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';
import updatePartyType from '../actions/updatePartyTypeAction';

export const updateStartCaseFormValueSequence = [
  set(state.form[props.key], props.value),
  updatePartyType,
];
