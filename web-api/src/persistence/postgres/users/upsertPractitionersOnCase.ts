import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getDbWriter } from '@web-api/database';

export const upsertPractitionersOnCase = async (
  practitioners: RawPractitioner[],
) => {
  if (practitioners.length === 0) return;

  const practitionersToUpsert = practitioners.map(practitioner => ({
    docketNumber: practitioner.docketNumber, // 10502 TODO
    email: practitioner.email || '',
    userId: practitioner.userId,
  }));

  await getDbWriter(writer =>
    writer
      .insertInto('dwPractitionerOnCase')
      .values(practitionersToUpsert)
      .onConflict(oc =>
        oc.columns(['docketNumber', 'userId']).doUpdateSet(c => {
          return {
            email: c.ref('excluded.email'),
          };
        }),
      )
      .execute(),
  );
};
