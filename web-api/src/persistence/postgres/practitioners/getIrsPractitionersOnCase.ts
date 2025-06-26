import { ROLES } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { irsPractitionerEntity } from '@web-api/persistence/postgres/practitioners/mapper';

export const getIrsPractitionersOnCase = async ({
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const irsPractitionersOnCase = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as uoc')
      .innerJoin('dwPractitioner as p', 'uoc.userId', 'p.userId')
      .innerJoin('dwUser as u', 'u.userId', 'uoc.userId')
      .where('uoc.docketNumber', '=', docketNumber)
      .where('u.role', '=', ROLES.irsPractitioner)
      .selectAll('p')
      .select(['uoc.representing', 'uoc.serviceIndicator'])
      .execute(),
  );

  return irsPractitionersOnCase.map(irsPractitionerOnCase =>
    irsPractitionerEntity(irsPractitionerOnCase).toRawObject(),
  );
};
