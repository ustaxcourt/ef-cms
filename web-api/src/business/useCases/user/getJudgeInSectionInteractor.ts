import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getJudgeInSectionInteractor = async (
  applicationContext: ServerApplicationContext,
  { section }: { section: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawUser> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_USERS_IN_SECTION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext
    .getUseCaseHelpers()
    .getJudgeInSectionHelper(applicationContext, { section });
};
