import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const chooseStartCaseWizardStepSequence = [
  set(state.wizardStep, props.value),
  set(state.form.wizardStep, props.step),
];
