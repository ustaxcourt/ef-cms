import { state } from 'cerebral';

/**
 * sets the representing from the representingMap on the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setRepresentingFromRepresentingMapActionFactory = stateLocation => ({
  get,
  store,
}) => {
  const form = get(state[stateLocation]);
  const representing = Object.keys(form.representingMap)
    .map(contactId => (form.representingMap[contactId] ? contactId : null))
    .filter(Boolean);

  store.set(state[stateLocation].representing, representing);
};
