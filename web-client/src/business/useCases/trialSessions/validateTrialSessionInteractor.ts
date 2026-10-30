import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { NewTrialSession } from '@shared/business/entities/trialSessions/NewTrialSession';
import { EditTrialSession } from '@shared/business/entities/trialSessions/EditTrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';

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
  if (
    trialSession.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.reporting &&
    errors &&
    (errors.startDate || errors.estimatedEndDate)
  ) {
    errors.startDate = 'Enter a valid due date';
    delete errors.estimatedEndDate;
  }
  return errors;
};
