import { state } from 'cerebral';

export const trialSessionsHelper = get => {
  const tab = get(state.trialSessionsTab.group);

  const isOpenTab = tab === 'open';
  const isAllTab = tab === 'all';

  let numCols = 5;
  if (isOpenTab) {
    numCols = 7;
  } else if (isAllTab) {
    numCols = 6;
  }

  return {
    numCols,
    showNoticeIssued: isOpenTab,
    showNumberOfCases: isOpenTab,
    showSessionStatus: isAllTab,
  };
};
