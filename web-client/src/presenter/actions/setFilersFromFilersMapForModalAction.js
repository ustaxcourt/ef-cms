import { state } from 'cerebral';

/**
 * sets the filers from the filersMap on the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setFilersFromFilersMapForModalAction = ({ get, store }) => {
  const modal = get(state.modal);
  const filers = Object.keys(modal.filersMap)
    .map(contactId => (modal.filersMap[contactId] ? contactId : null))
    .filter(Boolean);

  store.set(state.modal.filers, filers);
};
