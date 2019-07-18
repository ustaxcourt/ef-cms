import { state } from 'cerebral';

/**
 * changes the route to view the file-a-document of the docketNUmber
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 */
export const navigateToReviewFileADocumentAction = ({ get, router, store }) => {
  store.set(state.wizardStep, 'FileDocumentReview');
  const { docketNumber } = get(state.caseDetail);
  router.route(`/case-detail/${docketNumber}/file-a-document/review`);
};
