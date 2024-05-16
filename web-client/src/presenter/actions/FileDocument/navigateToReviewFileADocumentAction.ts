import { GENERATION_TYPES } from '@web-client/getConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to view the file-a-document of the docketNUmber
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.store the cerebral store that contains the caseDetail.docketNumber
 */
export const navigateToReviewFileADocumentAction = async ({
  get,
  router,
  store,
}: ActionProps) => {
  if (
    get(state.form.generationType) === GENERATION_TYPES.AUTO &&
    get(state.form.eventCode) === 'EA'
  ) {
    store.unset(state.form.redactionAcknowledgement);
  } else {
    store.set(state.form.redactionAcknowledgement, false);
  }
  store.set(state.wizardStep, 'FileDocumentReview');

  const { docketNumber } = get(state.caseDetail);
  await router.route(`/case-detail/${docketNumber}/file-a-document/review`);
};
