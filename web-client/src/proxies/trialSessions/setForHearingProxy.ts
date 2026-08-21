import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const setForHearingInteractor = (
  applicationContext: ClientApplicationContext,
  { calendarNotes, docketNumber, trialSessionId },
): Promise<CaseDTO> => {
  return post({
    applicationContext,
    body: {
      calendarNotes,
    },
    endpoint: `/trial-sessions/${trialSessionId}/set-hearing/${docketNumber}`,
  });
};
