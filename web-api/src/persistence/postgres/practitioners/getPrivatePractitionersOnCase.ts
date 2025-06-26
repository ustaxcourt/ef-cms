import { ROLES } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { privatePractitionerEntity } from '@web-api/persistence/postgres/practitioners/mapper';

export const getPrivatePractitionersOnCase = async ({
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const privatePractitionersOnCase = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as uoc')
      .innerJoin('dwPractitioner as p', 'uoc.userId', 'p.userId')
      .innerJoin('dwUser as u', 'u.userId', 'uoc.userId')
      .where('uoc.docketNumber', '=', docketNumber)
      .where('u.role', '=', ROLES.privatePractitioner)
      .selectAll('p')
      .select(['uoc.representing', 'uoc.serviceIndicator'])
      .execute(),
  );

  return privatePractitionersOnCase.map(privatePractitionerOnCase =>
    privatePractitionerEntity(privatePractitionerOnCase).toRawObject(),
  );
};
