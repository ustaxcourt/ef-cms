import { clearCaseAssociationWizardDataAction } from '../actions/clearCaseAssociationWizardDataAction';
import { setDefaultGenerationTypeAction } from '@web-client/presenter/actions/setDefaultGenerationTypeAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateCaseAssociationFormValueSequence = [
  setFormValueAction,
  setDefaultGenerationTypeAction,
  clearCaseAssociationWizardDataAction,
];
