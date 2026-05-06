import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { NewTrialSession } from '@shared/business/entities/trialSessions/NewTrialSession';
import { EditTrialSession } from '@shared/business/entities/trialSessions/EditTrialSession';

export const validateTrialSessionInteractor = ({
  trialSession,
}: {
  trialSession: RawTrialSession;
}): Record<string, any> | null => {
  let errors: Record<string, any> | null = null;
  if (trialSession.trialSessionId) {
    const entity = new EditTrialSession(trialSession);
    errors = entity.getFormattedValidationErrors();
  } else {
    errors = new NewTrialSession(trialSession).getFormattedValidationErrors();
  }
  return errors;
};
