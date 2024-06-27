import { GENERATION_TYPES } from '@web-client/getConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const navigateToReviewCaseAssociationRequestAction = async ({
  get,
  router,
  store,
}: ActionProps): Promise<void> => {
  const docketNumber = get(state.caseDetail.docketNumber);

  if (
    get(state.form.generationType) === GENERATION_TYPES.MANUAL &&
    get(state.form.eventCode) === 'EA'
  ) {
    store.set(state.form.redactionAcknowledgement, false);
  } else {
    store.unset(state.form.redactionAcknowledgement);
  }

  await router.route(
    `/case-detail/${docketNumber}/case-association-request/review`,
  );
};
