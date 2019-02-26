import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updateDocumentValueSequence = [
  set(state.document[props.key], props.value),
];
