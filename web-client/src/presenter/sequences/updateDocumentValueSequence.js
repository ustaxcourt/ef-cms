import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateDocumentValueSequence = [
  set(state.document[props.key], props.value),
];
