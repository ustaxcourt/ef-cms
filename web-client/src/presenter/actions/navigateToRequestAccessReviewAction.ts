import { GENERATION_TYPES } from '@web-client/getConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * navigates to the request access review page
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral function for getting values from the store
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToRequestAccessReviewAction = async ({
  applicationContext,
  get,
  router,
  store,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  const redactionAcknowledgementEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.REDACTION_ACKNOWLEDGEMENT_ENABLED.key
    ],
  );

  if (
    redactionAcknowledgementEnabled &&
    get(state.form.generationType) === GENERATION_TYPES.MANUAL &&
    get(state.form.eventCode) === 'EA'
  ) {
    store.set(state.form.redactionAcknowledgement, false);
  } else {
    store.unset(state.form.redactionAcknowledgement);
  }

  await router.route(`/case-detail/${docketNumber}/request-access/review`);
};
