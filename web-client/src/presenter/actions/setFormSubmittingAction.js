import { state } from 'cerebral';

/**
 * sets the state.submitting to true which is used for showing the document upload or spinner
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting the state.submitting
 */
export default ({ store }) => {
  store.set(state.submitting, true);
};
