import { state } from 'cerebral';

/**
 * changes the route to view the file-a-document of the docketNUmber
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.store the cerebral store that contains the caseDetail.docketNumber
 */
export const navigateToReviewFileADocumentAction = async ({
  get,
  router,
  store,
}) => {
  store.set(state.wizardStep, 'FileDocumentReview');
  const { docketNumber } = get(state.caseDetail);
  await router.route(`/case-detail/${docketNumber}/file-a-document/review`);
};
