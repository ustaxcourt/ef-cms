import { clearCaseAssociationWizardDataAction } from '../actions/clearCaseAssociationWizardDataAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateCaseAssociationFormValueSequence = [
  set(state.form[props.key], props.value),
  clearCaseAssociationWizardDataAction,
];
