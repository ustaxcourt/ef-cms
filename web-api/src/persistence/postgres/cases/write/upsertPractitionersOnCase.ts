import { getDbWriter } from '@web-api/database';
import { isEmpty } from 'lodash';

export const upsertPractitionersOnCase = async ({
  practitionersWithDocketNumber,
}: {
  practitionersWithDocketNumber: any; // 10502 TODO
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
          email: p.email,
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
