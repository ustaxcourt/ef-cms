import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { toKyselyNewUser, userEntity } from './mapper';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { applicationContext } from '@web-api/applicationContext';
import { createUser } from '@web-api/gateways/user/createUser';

export const createNewPractitionerUser = async ({
  user,
}: {
  user: RawPractitioner;
}): Promise<Practitioner> => {
  await createUser(applicationContext, {
    email: user.pendingEmail!,
    name: user.name,
    role: user.role,
    sendWelcomeEmail: true,
    userId: user.userId,
  });

  const createdUser = await pgInsertInto({
    table: 'dwUser',
    values: [toKyselyNewUser(user)],
  });

  return userEntity(createdUser) as Practitioner;
};
