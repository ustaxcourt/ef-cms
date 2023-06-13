import { state } from '@web-client/presenter/app.cerebral';

export const paperServiceStatusHelper = get => {
  const { pdfsAppended, totalPdfs } = get(state.paperServiceStatusState);

  return {
    percentComplete: Math.floor((pdfsAppended / totalPdfs) * 100),
  };
};
