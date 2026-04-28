import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const saveCalendarNoteInteractor = (
  applicationContext: ClientApplicationContext,
  { calendarNote, docketNumber, trialSessionId },
) => {
  return put({
    applicationContext,
    body: { calendarNote, docketNumber },
    endpoint: `/trial-sessions/${trialSessionId}/set-calendar-note`,
  });
};
