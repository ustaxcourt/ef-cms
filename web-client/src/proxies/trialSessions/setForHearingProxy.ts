import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const setForHearingInteractor = (
  applicationContext: ClientApplicationContext,
  { calendarNotes, docketNumber, trialSessionId },
) => {
  return post({
    applicationContext,
    body: {
      calendarNotes,
    },
    endpoint: `/trial-sessions/${trialSessionId}/set-hearing/${docketNumber}`,
  });
};
