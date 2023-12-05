import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionsHelper = (get: Get): any => {
  const permissions = get(state.permissions)!;
  const status = get(state.screenMetadata.trialSessionFilters.status);
  const tab =
    get(state.currentViewMetadata.trialSessions.tab) ||
    (status && status.toLowerCase());

  const isNewTab = tab === 'new';
  const isOpenTab = tab === 'open' || tab === undefined;
  const isAllTab = tab === 'all';

  let additionalColumnsShown = 0;
  if (isOpenTab || isAllTab) {
    additionalColumnsShown = 1;
  }

  const showCurrentJudgesOnly = isNewTab || isOpenTab;

  let trialSessionJudges;
  if (showCurrentJudgesOnly) {
    trialSessionJudges = get(state.judges);
  } else {
    trialSessionJudges = get(state.legacyAndCurrentJudges);
  }

  return {
    additionalColumnsShown,
    showNewTrialSession: permissions.CREATE_TRIAL_SESSION,
    showNoticeIssued: isOpenTab,
    showSessionStatus: isAllTab,
    showUnassignedJudgeFilter: isNewTab,
    trialSessionJudges,
  };
};
