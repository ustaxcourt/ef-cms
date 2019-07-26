import { clearCaseAssociationWizardDataAction } from '../actions/clearCaseAssociationWizardDataAction';
import { updateFormValueWithoutEmptyStringAction } from '../actions/updateFormValueWithoutEmptyStringAction';

export const updateCaseAssociationFormValueSequence = [
  updateFormValueWithoutEmptyStringAction,
  clearCaseAssociationWizardDataAction,
];
