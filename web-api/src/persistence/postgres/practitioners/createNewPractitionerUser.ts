import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { applicationContext } from '@web-api/applicationContext';
import { createUser } from '@web-api/gateways/user/createUser';
import { createUserRecord } from '../users/createUserRecord';
import { practitionerEntity, toKyselyNewPractitioner } from './mapper';

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

  const practitioner = await pgInsertInto({
    table: 'dwPractitioner',
    values: toKyselyNewPractitioner(user),
    onConflictColumns: ['userId'],
  });

  await createUserRecord({ user, userId: user.userId });

  return practitionerEntity(practitioner);
};
