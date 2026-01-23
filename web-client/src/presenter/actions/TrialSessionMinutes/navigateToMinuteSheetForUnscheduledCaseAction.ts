import { state } from '@web-client/presenter/app.cerebral';

/**
 * Opens the minute sheet page for an unscheduled case in a new tab
 * Uses lead case docket number if the case is consolidated
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.router the router object for navigation
 */
export const navigateToMinuteSheetForUnscheduledCaseAction = async ({
  get,
  router,
}: ActionProps) => {
  const caseInfo = get(state.modal.caseInfo);
  const trialSessionId = get(state.modal.trialSessionId);

  // Use lead case docket number if consolidated, otherwise use the case's docket number
  const docketNumber = caseInfo.leadDocketNumber || caseInfo.docketNumber;

  const url = `/trial-session-detail/${trialSessionId}/case/${docketNumber}/minutes?isUnscheduledCase=true`;

  if (window.localStorage?.getItem('__cypressMinuteSheetInSameTab')) {
    await router.route(url);
  } else {
    window.open(url, '_blank');
  }
};
