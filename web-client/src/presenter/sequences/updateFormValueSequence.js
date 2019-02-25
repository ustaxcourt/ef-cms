import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updateFormValueSequence = [
  set(state.form[props.key], props.value),
];
