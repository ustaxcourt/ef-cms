import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryFormValueSequence = [
  setFileDocumentFormValueAction,
  computeFormDateFactoryAction(null),
  setComputeFormDateFactoryAction('serviceDate'),
  updateDocketEntryWizardDataAction,
];
