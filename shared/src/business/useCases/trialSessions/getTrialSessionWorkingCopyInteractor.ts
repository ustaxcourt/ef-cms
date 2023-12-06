import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '../../entities/trialSessions/TrialSessionWorkingCopy';
import { User } from '../../entities/User';

/**
 * getTrialSessionWorkingCopyInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId id of the trial session
 * @returns {TrialSessionWorkingCopy} the trial session working copy returned from persistence
 */
export const getTrialSessionWorkingCopyInteractor = async (
  applicationContext: IApplicationContext,
  { trialSessionId }: { trialSessionId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUser = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId: user.userId,
  });

  const userEntity = new User(rawUser);

  const judgeUser = await applicationContext
    .getUseCaseHelpers()
    .getJudgeInSectionHelper(applicationContext, {
      section: userEntity.section,
    });

  const chambersUserId = (judgeUser && judgeUser.userId) || user.userId;

  let trialSessionWorkingCopyEntity, validRawTrialSessionWorkingCopyEntity;

  const trialSessionWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId,
      userId: chambersUserId,
    });

  if (trialSessionWorkingCopy) {
    trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
      trialSessionWorkingCopy,
    );
    validRawTrialSessionWorkingCopyEntity = trialSessionWorkingCopyEntity
      .validate()
      .toRawObject();
  } else {
    const trialSessionDetails = await applicationContext
      .getPersistenceGateway()
      .getTrialSessionById({
        applicationContext,
        trialSessionId,
      });

    if (!trialSessionDetails) {
      throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
    }

    const trialSessionEntity = new TrialSession(trialSessionDetails, {
      applicationContext,
    });

    const canCreateWorkingCopy =
      (trialSessionEntity.trialClerk &&
        trialSessionEntity.trialClerk.userId === chambersUserId) ||
      (judgeUser &&
        trialSessionEntity.judge &&
        judgeUser.userId === trialSessionEntity.judge.userId);

    if (canCreateWorkingCopy) {
      trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
        trialSessionId,
        userId: chambersUserId,
      });
      validRawTrialSessionWorkingCopyEntity = trialSessionWorkingCopyEntity
        .validate()
        .toRawObject();
      await applicationContext
        .getPersistenceGateway()
        .createTrialSessionWorkingCopy({
          applicationContext,
          trialSessionWorkingCopy: validRawTrialSessionWorkingCopyEntity,
        });
    } else {
      throw new NotFoundError('Trial session working copy not found');
    }
  }
  return validRawTrialSessionWorkingCopyEntity;
};
