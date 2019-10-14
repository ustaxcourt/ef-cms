import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { updateEditDocketEntryWizardDataAction } from '../actions/EditDocketRecord/updateEditDocketEntryWizardDataAction';

export const updateEditDocketEntryFormValueSequence = [
  set(state.form[props.key], props.value),
  updateEditDocketEntryWizardDataAction,
];
