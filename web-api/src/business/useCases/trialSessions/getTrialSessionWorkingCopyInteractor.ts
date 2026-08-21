import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  RawTrialSessionWorkingCopy,
  TrialSessionWorkingCopy,
} from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getTrialSessionWorkingCopies } from '@web-api/persistence/postgres/trialSessions/getTrialSessionWorkingCopies';
import { createTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/createTrialSessionWorkingCopy';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const getTrialSessionWorkingCopyInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawTrialSessionWorkingCopy> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUser = await getUserById({
    userId: authorizedUser.userId,
  });

  const userEntity = new User(rawUser);

  const judgeUser = await applicationContext
    .getUseCaseHelpers()
    .getJudgeInSectionHelper({
      section: userEntity.section,
    });

  const chambersUserId =
    (judgeUser && judgeUser.userId) || authorizedUser?.userId || '';

  let trialSessionWorkingCopyEntity: TrialSessionWorkingCopy;
  let validRawTrialSessionWorkingCopyEntity: RawTrialSessionWorkingCopy;

  const trialSessionWorkingCopy = (
    await getTrialSessionWorkingCopies({
      tsWorkingCopyIds: [{ trialSessionId, userId: chambersUserId }],
    })
  ).at(0);

  if (trialSessionWorkingCopy) {
    trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
      trialSessionWorkingCopy,
    );
    validRawTrialSessionWorkingCopyEntity = trialSessionWorkingCopyEntity
      .validate()
      .toRawObject();
  } else {
    const trialSessionDetails = await getTrialSessionById({
      trialSessionId,
    });

    if (!trialSessionDetails) {
      throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
    }

    const trialSessionEntity = new TrialSession(trialSessionDetails);

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
      await createTrialSessionWorkingCopy({
        trialSessionWorkingCopy: validRawTrialSessionWorkingCopyEntity,
      });
    } else {
      throw new NotFoundError('Trial session working copy not found');
    }
  }
  return validRawTrialSessionWorkingCopyEntity;
};
