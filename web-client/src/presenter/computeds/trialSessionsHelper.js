import { state } from 'cerebral';

export const trialSessionsHelper = get => {
  const tab = get(state.currentViewMetadata.trialSessions.tab);

  const isNewTab = tab === 'new';
  const isOpenTab = tab === 'open';
  const isAllTab = tab === 'all';

  let additionalColumnsShown = 0;
  if (isOpenTab) {
    additionalColumnsShown = 2;
  } else if (isAllTab) {
    additionalColumnsShown = 1;
  }

  return {
    additionalColumnsShown,
    showNoticeIssued: isOpenTab,
    showNumberOfCases: isOpenTab,
    showSessionStatus: isAllTab,
    showUnassignedJudgeFilter: isNewTab,
  };
};
