import { state } from 'cerebral';

/**
 * clears the modal so it won't be displayed
 * state.showModal used for specifying which modal to display.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting showModal
 */
export const clearModalAction = ({ store }) => {
  store.set(state.showModal, '');
};
