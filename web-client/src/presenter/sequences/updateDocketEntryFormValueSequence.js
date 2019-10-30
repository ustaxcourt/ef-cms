import { setFormValueAction } from '../actions/setFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryFormValueSequence = [
  setFormValueAction,
  updateDocketEntryWizardDataAction,
];
