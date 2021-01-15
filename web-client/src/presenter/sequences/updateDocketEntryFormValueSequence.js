import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryFormValueSequence = [
  setFileDocumentFormValueAction,
  computeFormDateFactoryAction(null),
  updateDocketEntryWizardDataAction,
];
