import { state } from 'cerebral';

/**
 * navigates to the request access review page
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral function for getting values from the store
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToRequestAccessReviewAction = async ({ get, router }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  await router.route(`/case-detail/${docketNumber}/request-access/review`);
};
