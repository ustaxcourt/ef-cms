import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryFormValueSequence = [
  set(state.form[props.key], props.value),
  updateDocketEntryWizardDataAction,
];
