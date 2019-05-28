import { state } from 'cerebral';

/**
 * sets the state.submitting to false
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.submitting
 */
export const unsetFormSubmittingAction = ({ store }) => {
  store.set(state.submitting, false);
};
