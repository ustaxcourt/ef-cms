import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '../../entities/trialSessions/TrialSessionWorkingCopy';

/**
 * createTrialSessionAndWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionToAdd the trial session data
 * @returns {object} the created trial session
 */
export const createTrialSessionAndWorkingCopy = async ({
  applicationContext,
  trialSessionToAdd,
}) => {
  const createdTrialSession = await applicationContext
    .getPersistenceGateway()
    .createTrialSession({
      applicationContext,
      trialSession: trialSessionToAdd.validate().toRawObject(),
    });

  if (trialSessionToAdd.judge && trialSessionToAdd.judge.userId) {
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
      trialSessionId: trialSessionToAdd.trialSessionId,
      userId: trialSessionToAdd.judge.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .createTrialSessionWorkingCopy({
        applicationContext,
        trialSessionWorkingCopy: trialSessionWorkingCopyEntity
          .validate()
          .toRawObject(),
      });
  }

  if (trialSessionToAdd.trialClerk && trialSessionToAdd.trialClerk.userId) {
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
      trialSessionId: trialSessionToAdd.trialSessionId,
      userId: trialSessionToAdd.trialClerk.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .createTrialSessionWorkingCopy({
        applicationContext,
        trialSessionWorkingCopy: trialSessionWorkingCopyEntity
          .validate()
          .toRawObject(),
      });
  }

  return new TrialSession(createdTrialSession, { applicationContext })
    .validate()
    .toRawObject();
};
