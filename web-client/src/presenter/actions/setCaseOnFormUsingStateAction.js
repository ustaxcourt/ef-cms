import { state } from 'cerebral';

/**
 * sets state.caseDetail on state.form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setCaseOnFormUsingStateAction = async ({ get, store }) => {
  const caseDetail = get(state.caseDetail);

  store.set(state.form, caseDetail);

  return { caseDetail };
};
