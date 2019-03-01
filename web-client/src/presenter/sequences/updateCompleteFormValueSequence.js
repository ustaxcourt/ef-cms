import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updateCompleteFormValueSequence = [
  set(state.completeForm[props.workItemId][props.key], props.value),
];
