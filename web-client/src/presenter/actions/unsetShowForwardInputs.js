import { state } from 'cerebral';

/**
 * sets the state.document.showForwardInputs to false
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.submitting
 */
export const unsetShowForwardInputs = ({ store }) => {
  store.set(state.document.showForwardInputs, false);
};
