import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { practitionerEntity, toKyselyNewPractitioner } from './mapper';
import { getUniqueId } from '@shared/sharedAppContext';

export const upsertPractitionerRecord = async ({
  practitioner,
  userId,
}: {
  practitioner: any;
  userId: string;
}) => {
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

  if (!practitionerData) return undefined;

  return practitionerEntity(practitionerData[0]);
};
