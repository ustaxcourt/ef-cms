import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
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
      .leftJoin('dwPractitioner as p', 'uoc.userId', 'p.userId')
      .where('uoc.docketNumber', '=', docketNumber)
      .where('uoc.entityName', '=', PrivatePractitioner.ENTITY_NAME)
      // 10495 TODO: does this function also need to get representing and service
      // indicator off of dwUserOnCase?
      .selectAll('p')
      .execute(),
  );

  return privatePractitionersOnCase.map(privatePractitionerOnCase =>
    privatePractitionerEntity(privatePractitionerOnCase).toRawObject(),
  );
};
