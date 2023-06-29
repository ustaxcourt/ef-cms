import { state } from '@web-client/presenter/app.cerebral';
/**
 * changes the route to view the review
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToReviewSavedPetitionAction = async ({
  get,
  router,
}: ActionProps) => {
  const docketEntryId = get(state.docketEntryId);
  const docketNumber = get(state.caseDetail.docketNumber);

  if (docketEntryId && docketNumber) {
    await router.route(
      `/case-detail/${docketNumber}/documents/${docketEntryId}/review`,
    );
  }
};
