import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryFormValueSequence = [
  setFileDocumentFormValueAction,
  updateDocketEntryWizardDataAction,
  generateTitleAction,
];
