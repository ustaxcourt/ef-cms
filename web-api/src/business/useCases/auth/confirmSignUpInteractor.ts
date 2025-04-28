import { InvalidRequest, NotFoundError } from '@web-api/errors/errors';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { User } from '@shared/business/entities/User';
import { getUserConfirmationCode } from '@web-api/persistence/postgres/users/getUserConfirmationCode';
import { updateUser } from '@web-api/gateways/user/updateUser';
import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';
import { confirmSignUp } from '@web-api/gateways/user/confirmSignUp';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

export const confirmSignUpInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    confirmationCode,
    email,
    userId,
  }: { confirmationCode: string; userId: string; email: string },
): Promise<void> => {
  const logger = getLogger();
  const accountConfirmationCode = await getUserConfirmationCode({ userId });

  if (accountConfirmationCode !== confirmationCode) {
    logger.info('User did not confirm account within 24hr', {
      email,
    });
    throw new InvalidRequest('Confirmation code expired');
  }

  await confirmSignUp(applicationContext, {
    email,
  });

  const updatePetitionerAttributes = updateUser(applicationContext, {
    attributesToUpdate: {
      email,
    },
    email,
  });

  await Promise.all([
    updatePetitionerAttributes,
    createPetitionerUser(applicationContext, { email, userId }),
  ]);
};

const createPetitionerUser = async (
  applicationContext: ServerApplicationContext,
  { email, userId }: { email: string; userId: string },
) => {
  const user = await getUserByEmail(applicationContext, { email });

  if (!user) {
    throw new NotFoundError(`User not found with email: ${email}`);
  }

  const userEntity = new User({
    email,
    name: user.name,
    role: ROLES.petitioner,
    userId,
  });

  await upsertUsers([userEntity.validate().toRawObject()]);

  return userEntity.validate().toRawObject();
};
