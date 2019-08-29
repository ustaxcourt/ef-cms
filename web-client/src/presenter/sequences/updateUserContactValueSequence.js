import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateUserContactValueSequence = [
  set(state.user[props.key], props.value),
];
