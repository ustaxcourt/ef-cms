import { state } from 'cerebral';
/**
 *  returns a callback function that sets wizardStep on state
 *
 * @param {string} wizardStep the value of wizardStep to be set
 * @returns {Function} returns a callback function that sets wizardStep on state
 */
export const setWizardStepAction =
  wizardStep =>
  /**
   * sets the value of state.wizardStep entry to the value passed in
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   */
  ({ store }) => {
    store.set(state.wizardStep, wizardStep);
  };
