import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateCompleteFormValueSequence = [
  set(state.completeForm[props.workItemId][props.key], props.value),
];
