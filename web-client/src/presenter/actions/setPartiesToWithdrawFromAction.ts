import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the partiesToWithdrawFrom from the partiesToWithdrawFromMap on the form
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setPartiesToWithdrawFromAction = ({ get, store }: ActionProps) => {
  const form = get(state.form);
  console.log('form', form);

  const partiesToWithdrawFrom = Object.keys(form.partiesToWithdrawFromMap)
    .map(contactId =>
      form.partiesToWithdrawFromMap[contactId] ? contactId : null,
    )
    .filter(Boolean);

  store.set(state.form.partiesToWithdrawFrom, partiesToWithdrawFrom);
};
