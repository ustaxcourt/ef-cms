import { clearCaseAssociationWizardDataAction } from '../actions/clearCaseAssociationWizardDataAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateCaseAssociationFormValueSequence = [
  setFormValueAction,
  clearCaseAssociationWizardDataAction,
];
