import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const userContactEditProgressHelper = (get: Get): any => {
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
