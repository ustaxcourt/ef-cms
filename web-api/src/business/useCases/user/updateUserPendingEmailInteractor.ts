import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { RawUser, User } from '@shared/business/entities/User';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

export const updateUserPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { pendingEmail }: { pendingEmail: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawUser | RawPractitioner> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(`Could not find user ${authorizedUser.userId}`);
  }

  await updateUserPendingEmail({ applicationContext, pendingEmail, user });

  let updatedUserRaw: RawUser | RawPractitioner;
  if (user.role === ROLES.petitioner) {
    updatedUserRaw = new User(user).validate().toRawObject();
  } else {
    updatedUserRaw = new Practitioner(user).validate().toRawObject();
  }

  await upsertUsers([updatedUserRaw]);

  await applicationContext.getUseCaseHelpers().sendEmailVerificationLink({
    applicationContext,
    pendingEmail,
    pendingEmailVerificationToken: updatedUserRaw.pendingEmailVerificationToken,
  });

  return updatedUserRaw;
};

export const updateUserPendingEmail = async ({
  applicationContext,
  pendingEmail,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: any;
  pendingEmail: string;
}) => {
  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const pendingEmailVerificationToken = applicationContext.getUniqueId();
  user.pendingEmailVerificationToken = pendingEmailVerificationToken;
  user.pendingEmailVerificationTokenTimestamp = createISODateString();
  user.pendingEmail = pendingEmail;
};
