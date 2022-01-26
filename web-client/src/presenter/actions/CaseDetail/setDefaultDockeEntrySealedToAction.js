import { state } from 'cerebral';

/**
 * Defaults state.modal.docketEntrySealedTo to 'Public'
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDefaultDockeEntrySealedToAction = ({ store }) => {
  store.set(state.modal.docketEntrySealedTo, 'Public');
};
