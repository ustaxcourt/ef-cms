import { state } from 'cerebral';

export const trialSessionsHelper = get => {
  const tab = get(state.currentViewMetadata.trialSessions.tab);

  const isNewTab = tab === 'new';
  const isOpenTab = tab === 'open';
  const isAllTab = tab === 'all';

  let additionalColumnsShown = 0;
  if (isOpenTab || isAllTab) {
    additionalColumnsShown = 1;
  }

  return {
    additionalColumnsShown,
    showNoticeIssued: isOpenTab,
    showSessionStatus: isAllTab,
    showUnassignedJudgeFilter: isNewTab,
  };
};
