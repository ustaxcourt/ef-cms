import { state } from 'cerebral';

export const userContactEditProgressHelper = get => {
  const completedCases = get(state.userContactEditProgress.completedCases) || 0;
  const totalCases = get(state.userContactEditProgress.totalCases) || 0;
  const percentComplete =
    completedCases && totalCases
      ? Math.floor((completedCases * 100) / totalCases)
      : 0;

  return {
    completedCases,
    percentComplete,
    totalCases,
  };
};
