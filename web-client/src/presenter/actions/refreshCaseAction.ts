import { state } from 'cerebral';

/**
 * Fetches the case using the getCase use case using the state.caseDetail.docketNumber
 * and sets state.caseDetail to the returned caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @param {object} providers.store the cerebral store function used to set state.caseDetail
 * @returns {Promise} async action
 */
export const refreshCaseAction = async ({ applicationContext, get, store }) => {
  const caseDetail = await applicationContext
    .getUseCases()
    .getCaseInteractor(applicationContext, {
      docketNumber: get(state.caseDetail.docketNumber),
    });
  store.set(state.caseDetail, caseDetail);
};
