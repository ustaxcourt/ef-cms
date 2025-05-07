import { getDbReader } from '@web-api/database';
import { irsPractitionerEntity, privatePractitionerEntity } from './mapper';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';

export const getPractitionersByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<{ irsPractitioners: any[]; privatePractitioners: any[] }> => {
  const practitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as oc')
      .leftJoin('dwPractitioner as p', 'oc.userId', 'p.userId')
      .where('oc.docketNumber', '=', docketNumber)
      .selectAll('p')
      .select(['oc.entityName', 'oc.representing'])
      .execute(),
  );

  return {
    irsPractitioners: practitioners
      .filter(p => p.entityName === IrsPractitioner.ENTITY_NAME)
      .map(p => irsPractitionerEntity(p)),
    privatePractitioners: practitioners
      .filter(p => p.entityName === PrivatePractitioner.ENTITY_NAME)
      .map(p => privatePractitionerEntity(p)),
  };
};
