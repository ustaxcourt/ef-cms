import { state } from 'cerebral';

/**
 * Clears the state.wizardStep.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetRequestAccessWizardStepAction = ({ store }: ActionProps) => {
  store.unset(state.wizardStep);
};
