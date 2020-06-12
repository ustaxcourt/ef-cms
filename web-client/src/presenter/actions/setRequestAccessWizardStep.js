import { state } from 'cerebral';

/**
 * Sets the state.wizardStep to the value passed in.
 *
 * @param {string} wizardStep the wizardStep
 * @returns {Function} a function that sets the wizardStep
 */
export const setRequestAccessWizardStepAction = wizardStep => {
  return ({ store }) => {
    store.set(state.wizardStep, wizardStep);
  };
};
