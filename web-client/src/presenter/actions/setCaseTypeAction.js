import { state } from 'cerebral';
/**
 *  Collapses all disclosure case types into a single 'Disclosure' case type
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @param {object} providers.store the cerebral store object
 */
export const setCaseTypeAction = ({ applicationContext, get, store }) => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const caseType = get(state.form.caseType);

  const disclosureCaseTypes = ['Disclosure1', 'Disclosure2'];

  if (disclosureCaseTypes.includes(caseType)) {
    store.set(state.form.caseType, CASE_TYPES_MAP.disclosure);
  }
};
