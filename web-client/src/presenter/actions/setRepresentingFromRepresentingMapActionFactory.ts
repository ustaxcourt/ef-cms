import { state } from 'cerebral';

/**
 * generates a function which sets the representing from the representingMap on the form
 *
 * @param {String} stateLocation the providers object
 * @returns {Function} action
 */
export const setRepresentingFromRepresentingMapActionFactory =
  stateLocation =>
  ({ get, store }) => {
    const form = get(state[stateLocation]);
    const representing = Object.keys(form.representingMap)
      .map(contactId => (form.representingMap[contactId] ? contactId : null))
      .filter(Boolean);

    store.set(state[stateLocation].representing, representing);
  };
