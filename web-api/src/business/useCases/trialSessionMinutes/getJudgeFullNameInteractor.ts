import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserById } from '@web-api/persistence/dynamo/users/getUserById';

export const getJudgeFullNameInteractor = async (
  { judgeUserId },
  authorizedUser: UnknownAuthUser,
  applicationContext,
): Promise<{ judgeFullName?: string }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { judgeFullName, judgeTitle } = await getUserById({
    applicationContext,
    userId: judgeUserId,
  });

  const judgeFullNameAndTitle = `${judgeTitle} ${judgeFullName}`;

  return { judgeFullName: judgeFullNameAndTitle };
};
