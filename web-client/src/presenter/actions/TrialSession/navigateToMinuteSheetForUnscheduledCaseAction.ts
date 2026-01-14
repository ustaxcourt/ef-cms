import { state } from '@web-client/presenter/app.cerebral';

/**
 * Opens the minute sheet page for an unscheduled case in a new tab
 * Uses lead case docket number if the case is consolidated
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 */
export const navigateToMinuteSheetForUnscheduledCaseAction = ({
  get,
}: ActionProps) => {
  const caseInfo = get(state.modal.caseInfo);
  const trialSessionId = get(state.modal.trialSessionId);

  // Use lead case docket number if consolidated, otherwise use the case's docket number
  const docketNumber = caseInfo.leadDocketNumber || caseInfo.docketNumber;

  window.open(
    `/trial-session-detail/${trialSessionId}/case/${docketNumber}/minutes?isUnscheduledCase=true`,
    '_blank',
  );
};
