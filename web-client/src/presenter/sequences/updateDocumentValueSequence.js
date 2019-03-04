import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updateDocumentValueSequence = [
  set(state.document[props.key], props.value),
];
