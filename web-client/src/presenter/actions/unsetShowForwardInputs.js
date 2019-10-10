import { state } from 'cerebral';

/**
 * sets the state.document.showForwardInputs to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.document.showForwardInputs
 */
export const unsetShowForwardInputs = ({ store }) => {
  store.set(state.document.showForwardInputs, false);
};
