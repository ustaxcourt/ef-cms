import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateFormValueSequence = [
  set(state.form[props.key], props.value),
];
