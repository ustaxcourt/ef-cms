import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the filers from the filersMap or filedBy on the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setFilersFromFilersMapAction = ({ get, store }) => {
  let filers;
  const form = get(state.form);

  filers = Object.keys(form.filersMap)
    .map(contactId => (form.filersMap[contactId] ? contactId : null))
    .filter(Boolean);

  if (isEmpty(form.filersMap) && form.filedBy) {
    filers = [form.filedBy];
  }

  store.set(state.form.filers, filers);
};
