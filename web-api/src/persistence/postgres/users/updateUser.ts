import { RawUser } from '@shared/business/entities/User';
import { pgUpdateTable } from '../utils/operation/pgUpdateTable';
import { toKyselyUpdateUser } from './mapper';
import { isEmpty } from 'lodash';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { toKyselyUpdatePractitioner } from '@web-api/persistence/postgres/practitioners/mapper';
import {
  PRACTITIONER_ROLES,
  ROLES,
} from '@shared/business/entities/EntityConstants';

export const updateUser = async ({
  userToUpdate,
}: {
  userToUpdate: RawUser | RawPractitioner;
}): Promise<void> => {
  const updatedUser = await pgUpdateTable({
    table: 'dwUser',
    values: toKyselyUpdateUser(userToUpdate),
    where: cb => cb.where('userId', '=', userToUpdate.userId),
  });
  if (isEmpty(updatedUser)) {
    throw new Error('could not update the user record');
  }

  if (PRACTITIONER_ROLES.includes(ROLES[userToUpdate.role])) {
    const updatedPractitioner = await pgUpdateTable({
      table: 'dwPractitioner',
      values: toKyselyUpdatePractitioner(userToUpdate as RawPractitioner),
      where: cb => cb.where('userId', '=', userToUpdate.userId),
    });
    if (isEmpty(updatedPractitioner)) {
      throw new Error('could not update the practitioner record');
    }
  }
};
