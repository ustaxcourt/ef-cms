import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const chooseModalWizardStepSequence = [
  set(state.modal.wizardStep, props.value),
];
