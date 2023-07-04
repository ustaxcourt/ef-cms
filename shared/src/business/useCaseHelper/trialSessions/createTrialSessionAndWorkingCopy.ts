import { TrialSessionFactory } from '../../entities/trialSessions/TrialSessionFactory';
import { TrialSessionWorkingCopy } from '../../entities/trialSessions/TrialSessionWorkingCopy';

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

  return TrialSessionFactory(createdTrialSession, applicationContext)
    .validate()
    .toRawObject();
};
