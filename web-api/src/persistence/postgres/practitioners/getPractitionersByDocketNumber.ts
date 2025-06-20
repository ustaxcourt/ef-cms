import { getDbReader } from '@web-api/database';
import { irsPractitionerEntity, privatePractitionerEntity } from './mapper';
import { PRACTICE_TYPE } from '@shared/business/entities/EntityConstants';

export const getPractitionersByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<{ irsPractitioners: any[]; privatePractitioners: any[] }> => {
  const practitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as oc')
      .innerJoin('dwPractitioner as p', 'oc.userId', 'p.userId')
      .where('oc.docketNumber', '=', docketNumber)
      .selectAll('p')
      .select(['oc.entityName', 'oc.representing'])
      .execute(),
  );

  return {
    irsPractitioners: practitioners
      .filter(p => p.practiceType !== PRACTICE_TYPE.Private)
      .map(p => irsPractitionerEntity(p)),
    privatePractitioners: practitioners
      .filter(p => p.practiceType === PRACTICE_TYPE.Private)
      .map(p => privatePractitionerEntity(p)),
  };
};
