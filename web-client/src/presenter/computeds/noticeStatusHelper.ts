import { state } from 'cerebral';

export const noticeStatusHelper = get => {
  const { casesProcessed, totalCases } = get(state.noticeStatusState);

  return {
    percentComplete: Math.floor((casesProcessed / totalCases) * 100),
  };
};
