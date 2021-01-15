import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryFormValueSequence = [
  setFileDocumentFormValueAction,
  getComputedFormDateFactoryAction(null),
  updateDocketEntryWizardDataAction,
];
