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
      .select(['uoc.entityName', 'uoc.representing', 'uoc.serviceIndicator'])
      .execute(),
  );

  return privatePractitionersOnCase.map(privatePractitionerOnCase =>
    privatePractitionerEntity(privatePractitionerOnCase).toRawObject(),
  );
};
