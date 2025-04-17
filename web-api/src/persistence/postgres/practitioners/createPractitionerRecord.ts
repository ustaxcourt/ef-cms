import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { practitionerEntity, toKyselyNewPractitioner } from './mapper';
import { getUniqueId } from '@shared/sharedAppContext';

export const createPractitionerRecord = async ({
  practitioner,
  userId,
}: {
  practitioner: any;
  userId: string;
}) => {
  delete practitioner.password;

  if (practitioner.barNumber === '') {
    delete practitioner.barNumber;
  }

  const practitionerData = await pgInsertInto({
    table: 'dwPractitioner',
    values: toKyselyNewPractitioner({
      ...practitioner,
      userId,
      practitionerId: practitioner.practitionerId || getUniqueId(),
    }),
    onConflictColumns: ['userId'],
  });

  return practitionerEntity(practitionerData);
};
