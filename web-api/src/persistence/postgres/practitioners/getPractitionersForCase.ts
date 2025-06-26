import { getDbReader } from '@web-api/database';
import { irsPractitionerEntity, privatePractitionerEntity } from './mapper';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const getPractitionersForCase = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<{ irsPractitioners: any[]; privatePractitioners: any[] }> => {
  const practitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as uoc')
      .innerJoin('dwPractitioner as p', 'uoc.userId', 'p.userId')
      .innerJoin('dwUser as u', 'u.userId', 'uoc.userId')
      .where('uoc.docketNumber', '=', docketNumber)
      .where('u.role', 'in', [ROLES.irsPractitioner, ROLES.privatePractitioner])
      .selectAll('p')
      .select(['uoc.representing', 'uoc.serviceIndicator'])
      .execute(),
  );

  return {
    irsPractitioners: practitioners
      .filter(p => p.role === ROLES.irsPractitioner)
      .map(p => irsPractitionerEntity(p)),
    privatePractitioners: practitioners
      .filter(p => p.role === ROLES.privatePractitioner)
      .map(p => privatePractitionerEntity(p)),
  };
};
