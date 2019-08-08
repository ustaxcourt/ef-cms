import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';
import { updateFormValueWithoutEmptyStringAction } from '../actions/updateFormValueWithoutEmptyStringAction';

export const updateDocketEntryFormValueSequence = [
  updateFormValueWithoutEmptyStringAction,
  updateDocketEntryWizardDataAction,
];
