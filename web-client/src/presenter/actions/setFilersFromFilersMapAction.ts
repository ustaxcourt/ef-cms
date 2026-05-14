import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the filers from the filersMap on the form
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setFilersFromFilersMapAction = ({ get, store }: ActionProps) => {
  const form = get(state.form);

  const filersMap = form.filersMap || {};
  const filers = Object.keys(filersMap)
    .map(contactId => (filersMap[contactId] ? contactId : null))
    .filter(Boolean);

  store.set(state.form.filers, filers);
};
