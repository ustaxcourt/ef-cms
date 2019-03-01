import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updateForwardFormValueSequence = [
  set(state.form[props.workItemId][props.key], props.value),
];
