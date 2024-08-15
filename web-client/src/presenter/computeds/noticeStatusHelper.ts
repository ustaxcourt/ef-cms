import { state } from '@web-client/presenter/app.cerebral';

import { Get } from '../../utilities/cerebralWrapper';
export const noticeStatusHelper = (get: Get): { percentComplete: number } => {
  const { casesProcessed, totalCases } = get(state.noticeStatusState);

  return {
    percentComplete: Math.floor((casesProcessed / totalCases) * 100),
  };
};
