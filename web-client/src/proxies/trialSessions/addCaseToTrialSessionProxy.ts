import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const addCaseToTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { calendarNotes, docketNumber, trialSessionId },
): Promise<CaseDTO> => {
  return post({
    applicationContext,
    body: { calendarNotes },
    endpoint: `/trial-sessions/${trialSessionId}/cases/${docketNumber}`,
  });
};
