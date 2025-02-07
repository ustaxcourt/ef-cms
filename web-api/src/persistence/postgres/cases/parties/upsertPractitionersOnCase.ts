import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertPractitionersOnCase = async ({
  practitionersWithDocketNumber,
}: {
  practitionersWithDocketNumber: (RawPractitioner & { docketNumber: string })[];
}): Promise<void> => {
  await pgInsertInto({
    table: 'dwPractitionerOnCase',
    values: practitionersWithDocketNumber.map(p => ({
      docketNumber: p.docketNumber,
      email: p.email || '',
      userId: p.userId,
    })),
    onConflictColumns: ['docketNumber', 'userId'],
  });
};
