import { state } from 'cerebral';

/**
 * Clears the state.wizardStep.
 *
 */
export const unsetRequestAccessWizardStepAction = ({ store }) => {
  store.unset(state.wizardStep);
};
