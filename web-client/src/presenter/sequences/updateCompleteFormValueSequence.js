import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updateCompleteFormValueSequence = [
  set(state.completeForm[props.workItemId][props.key], props.value),
];
