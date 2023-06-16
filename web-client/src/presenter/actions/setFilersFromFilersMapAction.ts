import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the filers from the filersMap on the form
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setFilersFromFilersMapAction = ({ get, store }: ActionProps) => {
  let filers;
  const form = get(state.form);

  filers = Object.keys(form.filersMap)
    .map(contactId => (form.filersMap[contactId] ? contactId : null))
    .filter(Boolean);

  store.set(state.form.filers, filers);
};
