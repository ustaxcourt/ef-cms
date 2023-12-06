import { clearWizardDataAction } from '../actions/FileDocument/clearWizardDataAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';

export const updateFileDocumentWizardFormValueSequence = [
  setFileDocumentFormValueAction,
  clearWizardDataAction,
  defaultSecondaryDocumentAction,
];
