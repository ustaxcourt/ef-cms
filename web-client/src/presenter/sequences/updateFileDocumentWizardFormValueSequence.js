import { clearWizardDataAction } from '../actions/FileDocument/clearWizardDataAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateFileDocumentWizardFormValueSequence = [
  setFormValueAction,
  clearWizardDataAction,
  defaultSecondaryDocumentAction,
];
