import { state } from 'cerebral';

/**
 * Fetches the case using the getCase use case using the state.caseDetail.docketNumber
 * and sets state.caseDetail to the returned caseDetail
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCase use case
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @param {Object} providers.store the cerebral store function used to set state.caseDetail
 */
export const refreshCaseAction = async ({ applicationContext, get, store }) => {
  const caseDetail = await applicationContext.getUseCases().getCase({
    applicationContext,
    docketNumber: get(state.caseDetail.docketNumber),
  });
  store.set(state.caseDetail, caseDetail);
};
