import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
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
      .leftJoin('dwPractitioner as p', 'uoc.userId', 'p.userId')
      .where('uoc.docketNumber', '=', docketNumber)
      .where('uoc.entityName', '=', IrsPractitioner.ENTITY_NAME)
      .selectAll('p')
      // 10495 TODO: does this function also need to get representing and service
      // indicator off of dwUserOnCase?
      .execute(),
  );

  return irsPractitionersOnCase.map(irsPractitionerOnCase =>
    irsPractitionerEntity(irsPractitionerOnCase).toRawObject(),
  );
};
