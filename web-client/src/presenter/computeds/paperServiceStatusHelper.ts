import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const paperServiceStatusHelper = (get: Get) => {
  const { pdfsAppended, totalPdfs } = get(state.paperServiceStatusState);

  return {
    percentComplete: Math.floor((pdfsAppended / totalPdfs) * 100),
  };
};
