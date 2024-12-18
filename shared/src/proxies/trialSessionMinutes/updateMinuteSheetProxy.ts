import { put } from '../requests';

export const updateMinuteSheetInteractor = (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
  return put({
    applicationContext,
    body: {
      docketNumber,
      trialSessionId,
    },
    endpoint: '/trial-sessions/minutes',
  });
};
