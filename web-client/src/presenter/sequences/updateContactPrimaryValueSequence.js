import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateContactPrimaryValueSequence = [
  set(state.contactToEdit[props.key], props.value),
];
