import { state } from 'cerebral';

/**
 * sets the state.submitting to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.submitting
 */
export const unsetFormSubmittingAction = ({ store }) => {
  store.set(state.submitting, false);
};
