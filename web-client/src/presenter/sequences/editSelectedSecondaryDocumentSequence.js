import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const editSelectedSecondaryDocumentSequence = [
  set(state.form.isSecondaryDocumentTypeSelected, false),
];
