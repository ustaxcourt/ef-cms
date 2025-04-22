import {
  RawPractitioner,
  Practitioner,
} from '@shared/business/entities/Practitioner';
import { pgUpdateTable } from '../utils/operation/pgUpdateTable';
import { toKyselyUpdatePractitioner, practitionerEntity } from './mapper';
import { isEmpty } from 'lodash';

export const updatePractitioner = async ({
  practitionerToUpdate,
}: {
  practitionerToUpdate: RawPractitioner;
}): Promise<Practitioner> => {
  const updatedPractitioner = await pgUpdateTable({
    table: 'dwPractitioner',
    values: toKyselyUpdatePractitioner(practitionerToUpdate),
    where: cb => cb.where('userId', '=', practitionerToUpdate.userId),
  });

  if (isEmpty(updatedPractitioner)) {
    throw new Error('could not update the practitioner');
  }

  return practitionerEntity(updatedPractitioner);
};
