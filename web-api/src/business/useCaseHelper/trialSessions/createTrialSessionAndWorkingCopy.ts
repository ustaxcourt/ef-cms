import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { createTrialSession } from '@web-api/persistence/postgres/trialSessions/createTrialSession';
import { createTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/createTrialSessionWorkingCopy';

/**
 * createTrialSessionAndWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionToAdd the trial session data
 * @returns {object} the created trial session
 */
export const createTrialSessionAndWorkingCopy = async ({
  trialSessionToAdd,
}) => {
  const createdTrialSession = await createTrialSession({
      trialSession: trialSessionToAdd.validate().toRawObject(),
    });

  if (trialSessionToAdd.judge && trialSessionToAdd.judge.userId) {
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
      trialSessionId: trialSessionToAdd.trialSessionId,
      userId: trialSessionToAdd.judge.userId,
    });

    await createTrialSessionWorkingCopy({
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

    await createTrialSessionWorkingCopy({
      trialSessionWorkingCopy: trialSessionWorkingCopyEntity
        .validate()
        .toRawObject(),
    });
  }

  return new TrialSession(createdTrialSession).validate().toRawObject();
};
