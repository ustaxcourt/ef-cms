import { state } from '@web-client/presenter/app.cerebral';

/**
 * Navigates to the minute sheet page for an unscheduled case
 * Uses lead case docket number if the case is consolidated
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.router the cerebral router
 */
export const navigateToMinuteSheetForUnscheduledCaseAction = async ({
  get,
  router,
}: ActionProps) => {
  const caseInfo = get(state.modal.caseInfo);
  const trialSessionId = get(state.modal.trialSessionId);

  // Use lead case docket number if consolidated, otherwise use the case's docket number
  const docketNumber = caseInfo.leadDocketNumber || caseInfo.docketNumber;

  await router.route(
    `/trial-session-detail/${trialSessionId}/case/${docketNumber}/minutes?isUnscheduledCase=true`,
  );
};
