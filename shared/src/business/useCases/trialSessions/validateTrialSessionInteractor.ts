import {
  NewTrialSession,
  RawNewTrialSession,
} from '../../entities/trialSessions/NewTrialSession';

export const validateTrialSessionInteractor = (
  applicationContext: IApplicationContext,
  { trialSession }: { trialSession: RawNewTrialSession },
) => {
  const errors = new NewTrialSession(trialSession, {
    applicationContext,
  }).getFormattedValidationErrors();

  return errors || null;
};
