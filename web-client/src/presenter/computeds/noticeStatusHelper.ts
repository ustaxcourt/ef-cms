import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const noticeStatusHelper = (get: Get) => {
  const { casesProcessed, totalCases } = get(state.noticeStatusState);

  return {
    percentComplete: Math.floor((casesProcessed / totalCases) * 100),
  };
};
