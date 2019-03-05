import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updateFormValueSequence = [
  set(state.form[props.key], props.value),
];
