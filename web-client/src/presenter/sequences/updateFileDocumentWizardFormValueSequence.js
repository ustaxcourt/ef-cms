import { clearWizardDataAction } from '../actions/FileDocument/clearWizardDataAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { updateFormValueWithoutEmptyStringAction } from '../actions/updateFormValueWithoutEmptyStringAction';

export const updateFileDocumentWizardFormValueSequence = [
  updateFormValueWithoutEmptyStringAction,
  clearWizardDataAction,
  defaultSecondaryDocumentAction,
];
