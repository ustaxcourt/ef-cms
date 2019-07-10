import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { updateDocumentForEventCodeAction } from '../actions/FileDocument/updateDocumentForEventCodeAction';

export const updateFileDocumentSelectFormValueSequence = [
  set(state.form[props.key], props.value),
  updateDocumentForEventCodeAction,
];
