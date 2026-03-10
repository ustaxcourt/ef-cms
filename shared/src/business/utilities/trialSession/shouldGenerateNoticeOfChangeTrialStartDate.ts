import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

export function shouldGenerateNoticeOfChangeTrialStartDate(
  currentTrialSession: RawTrialSession,
  updatedTrialSession: RawTrialSession,
): boolean {
  if (!currentTrialSession.isCalendared || !updatedTrialSession.isCalendared)
    return false;

  return currentTrialSession.startDate !== updatedTrialSession.startDate;
}
