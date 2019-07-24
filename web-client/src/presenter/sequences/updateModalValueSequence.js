import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateModalValueSequence = [
  set(state.modal[props.key], props.value),
];
