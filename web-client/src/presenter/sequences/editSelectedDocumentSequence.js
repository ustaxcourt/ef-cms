import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const editSelectedDocumentSequence = [
  set(state.form.isDocumentTypeSelected, false),
];
