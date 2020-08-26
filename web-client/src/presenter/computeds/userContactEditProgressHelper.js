import { state } from 'cerebral';

export const userContactEditProgressHelper = get => {
  const completedCases = get(state.userContactEditProgress.completedCases) || 0;
  const totalCases = get(state.userContactEditProgress.totalCases) || 0;

  return {
    completedCases,
    percentComplete: Math.floor((completedCases * 100) / totalCases),
    totalCases,
  };
};
