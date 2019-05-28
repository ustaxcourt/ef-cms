import { state } from 'cerebral';

/**
 * clears the modal state
 * state.modal used for temp modal state
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting showModal
 */
export const clearModalStateAction = ({ store }) => {
  store.set(state.modal, {});
};
