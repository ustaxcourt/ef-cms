import { state } from 'cerebral';

/**
 * sets props.caseDetail on state.form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setCaseOnFormUsingStateAction = async ({ get, store }) => {
  store.set(state.form, get(state.caseDetail));
};
