import { getDbReader } from '@web-api/database';
import { irsPractitionerEntity, privatePractitionerEntity } from './mapper';
import { PRACTICE_TYPE } from '@shared/business/entities/EntityConstants';

export const getPractitionersForCase = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<{ irsPractitioners: any[]; privatePractitioners: any[] }> => {
  const practitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as oc')
      .innerJoin('dwPractitioner as p', 'oc.userId', 'p.userId')
      .where('oc.docketNumber', '=', docketNumber)
      .select([
        // 10495 TODO: select everything off dwPractitioner except for serviceIndicator
        'p.additionalPhone',
        'p.address1',
        'p.address2',
        'p.address3',
        'p.admissionsDate',
        'p.admissionsStatus',
        'p.barNumber',
        'p.birthYear',
        'p.city',
        'p.confirmEmail',
        'p.country',
        'p.countryType',
        'p.email',
        'p.firmName',
        'p.firstName',
        'p.lastName',
        'p.middleName',
        'p.name',
        'p.originalBarState',
        'p.phone',
        'p.postalCode',
        'p.practiceType',
        'p.practitionerId',
        'p.practitionerNotes',
        'p.practitionerType',
        'p.role',
        'p.section',
        'p.state',
        'p.suffix',
        'p.updatedEmail',
        'p.userId',
      ])
      .select(['oc.entityName', 'oc.representing', 'oc.serviceIndicator'])
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
