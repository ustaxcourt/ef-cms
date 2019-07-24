import { state } from 'cerebral';

/**
 * sets the state.submitting to true which is used for showing the document upload or spinner
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting the state.submitting
 */
export const setFormSubmittingAction = ({ store }) => {
  store.set(state.submitting, true);
};
