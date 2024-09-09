import { Get } from 'cerebral';
import { SESSION_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { state } from '@web-client/presenter/app.cerebral';
import { trialSessionOptionText } from './addToTrialSessionModalHelper';

export const formattedTrialSessions = (
  get: Get,
): {
  swingSessions: { trialSessionId: string; swingSessionText: string }[];
  showSwingSessionList: boolean;
  showSwingSessionOption: boolean;
} => {
  const trialSessions: TrialSessionInfoDTO[] = get(state.trialSessions) || [];
  const selectedTerm = get(state.form.term);
  const selectedTermYear = get(state.form.termYear);
  const currentTrialSessionId = get(state.trialSession.trialSessionId);

  const validSwingSessions: {
    trialSessionId: string;
    swingSessionText: string;
  }[] = trialSessions
    .filter(trialSession => trialSession.termYear === selectedTermYear)
    .filter(trialSession => trialSession.term === selectedTerm)
    .filter(
      trialSession =>
        trialSession.sessionStatus !== SESSION_STATUS_TYPES.closed,
    )
    .filter(
      trialSession => trialSession.trialSessionId !== currentTrialSessionId,
    )
    .sort((sessionA, sessionB) => {
      const aTrialLocation = sessionA.trialLocation || '';
      const bTrialLocation = sessionB.trialLocation || '';
      if (aTrialLocation === bTrialLocation) {
        return sessionA.startDate.localeCompare(sessionB.startDate);
      }
      return aTrialLocation.localeCompare(bTrialLocation);
    })
    .map(trialSession => {
      const swingSessionText = trialSessionOptionText(trialSession);
      return {
        swingSessionText,
        trialSessionId: trialSession.trialSessionId || '',
      };
    });

  return {
    showSwingSessionList: get(state.form.swingSession),
    showSwingSessionOption: validSwingSessions.length > 0,
    swingSessions: validSwingSessions,
  };
};
