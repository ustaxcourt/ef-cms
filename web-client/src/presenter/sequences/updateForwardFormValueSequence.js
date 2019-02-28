import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updateForwardFormValueSequence = [
  set(state.form[props.workItemId][props.key], props.value),
];
