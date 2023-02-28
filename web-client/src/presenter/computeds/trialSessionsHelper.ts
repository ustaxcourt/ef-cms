import { state } from 'cerebral';

export const trialSessionsHelper = get => {
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
    showNoticeIssued: isOpenTab,
    showSessionStatus: isAllTab,
    showUnassignedJudgeFilter: isNewTab,
    trialSessionJudges,
  };
};
