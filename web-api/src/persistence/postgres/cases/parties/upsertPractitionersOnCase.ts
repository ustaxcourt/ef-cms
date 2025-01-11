import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getDbWriter } from '@web-api/database';
import { isEmpty } from 'lodash';

export const upsertPractitionersOnCase = async ({
  practitionersWithDocketNumber,
}: {
  practitionersWithDocketNumber: (RawPractitioner & { docketNumber: string })[];
}): Promise<void> => {
  if (isEmpty(practitionersWithDocketNumber)) {
    return;
  }
  await getDbWriter(writer =>
    writer
      .insertInto('dwPractitionerOnCase')
      .values(
        practitionersWithDocketNumber.map(p => ({
          docketNumber: p.docketNumber,
          email: p.email || '',
          userId: p.userId,
        })),
      )
      .onConflict(oc =>
        oc.columns(['docketNumber', 'userId']).doUpdateSet(s => {
          return {
            email: s.ref('excluded.email'),
          };
        }),
      )
      .execute(),
  );
};
