import { clearWizardDataAction } from '../actions/FileDocument/clearWizardDataAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';

// Nate look here.?
export const updateFileDocumentWizardFormValueSequence = [
  setFileDocumentFormValueAction,
  clearWizardDataAction,
  defaultSecondaryDocumentAction,
];
