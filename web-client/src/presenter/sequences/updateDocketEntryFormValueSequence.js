import { clearDocketEntryWizardDataAction } from '../actions/DocketEntry/clearDocketEntryWizardDataAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateDocketEntryFormValueSequence = [
  set(state.form[props.key], props.value),
  clearDocketEntryWizardDataAction,
];
