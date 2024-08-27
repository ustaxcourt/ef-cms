import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { RawPractitioner } from '../../../../../shared/src/business/entities/Practitioner';
import { RawUser } from '../../../../../shared/src/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '../../../errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createOrUpdateUser } from '../../../../../shared/admin-tools/user/admin';

export const createUserInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    user,
  }: {
    user: (RawUser | RawPractitioner) & {
      password: string;
    };
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawUser> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CREATE_USER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // eslint-disable-next-line spellcheck/spell-checker
  /* NOTE: This is a very unique interactor and breaks some convention.
  This interactor is only meant to be run by admins and zendesk automations, not by real users.
  That is why this interactor is not attached to applicationContext and is doing a direct import from the scripts directory
  */
  const { password, ...everyThingElse } = user;
  return await createOrUpdateUser(applicationContext, {
    password,
    setPasswordAsPermanent: false,
    user: everyThingElse,
  });
};
