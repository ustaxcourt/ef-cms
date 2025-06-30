import { getUniqueId } from '@shared/sharedAppContext';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { practitionerEntity, toKyselyNewPractitioner } from './mapper';
import { Practitioner } from '@shared/business/entities/Practitioner';

export const upsertPractitionerRecords = async (
  practitioners: { practitioner: any; userId: string }[], // TODO 10495: why is the userId separate? consolidate maybe
): Promise<Practitioner[]> => {
  if (!practitioners.length) return [];
  const records = practitioners.map(p => {
    return toKyselyNewPractitioner({
      ...p.practitioner,
      barNumber:
        p.practitioner.barNumber === '' ? undefined : p.practitioner.barNumber,
      userId: p.userId,
      practitionerId: p.userId || getUniqueId(),
    });
  });

  const practitionerData = await pgInsertInto({
    table: 'dwPractitioner',
    values: records,
    onConflictColumns: ['userId'],
  });

  return practitionerData.map(p => practitionerEntity(p));
};
