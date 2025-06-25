import { getDbReader } from '@web-api/database';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { rawUser } from '@web-api/persistence/postgres/users/mapper';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';

export const getPractitionersForCase = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<{
  irsPractitioners: RawIrsPractitioner[];
  privatePractitioners: RawPrivatePractitioner[];
}> => {
  const practitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as oc')
      .innerJoin('dwUser as u', 'oc.userId', 'u.userId')
      .where('oc.docketNumber', '=', docketNumber)
      .selectAll('u')
      .select(['oc.representing', 'oc.serviceIndicator'])
      .execute(),
  );

  return {
    irsPractitioners: practitioners
      .filter(p => p.role === ROLES.irsPractitioner)
      .map(p => rawUser(p) as RawIrsPractitioner),
    privatePractitioners: practitioners
      .filter(p => p.role === ROLES.privatePractitioner)
      .map(p => rawUser(p) as RawPrivatePractitioner),
  };
};

/*
 The only funny business is a private practitioner acting as a petitioner
*/
