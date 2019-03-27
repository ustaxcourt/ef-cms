import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const toggleFileDocumentFormSequence = [
  set(state.showFileDocumentForm, props.value),
];
