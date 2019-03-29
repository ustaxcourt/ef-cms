import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { clearModalAction } from '../actions/clearModalAction';

// TODO: run validation on the form
// TOOD: run a goto sequence to view the next page which changes depending on the document type selected
export const selectDocumentSequence = [
  set(state.form.isDocumentTypeSelected, true),
  clearModalAction,
];
