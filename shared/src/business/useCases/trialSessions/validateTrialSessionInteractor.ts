import { NewTrialSession } from '../../entities/trialSessions/NewTrialSession';
import { TRawTrialSession } from '../../entities/trialSessions/TrialSession';

/**
 * validateTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {object} errors (null if no errors)
 */
export const validateTrialSessionInteractor = (
  applicationContext: IApplicationContext,
  { trialSession }: { trialSession: TRawTrialSession },
) => {
  const errors = new NewTrialSession(trialSession, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
