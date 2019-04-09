import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const chooseWizardStepSequence = [set(state.wizardStep, props.value)];
