import { ROLES } from '@shared/business/entities/EntityConstants';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawUser } from '@shared/business/entities/User';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  NewPractitionerKysely,
  UpdatePractitionerKysely,
} from '@web-api/persistence/postgres/practitioners/schema';
import { contactInfo } from '@web-api/persistence/postgres/users/mapper';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { DW_PRACTITIONER_COLUMNS } from '@web-api/persistence/postgres/practitioners/schema';

// 10495 TODO: do not use `any` below please
export function pickPractitionerFields(user: any) {
  return {
    additionalPhone: user.additionalPhone,
    admissionsDate: user.admissionsDate,
    admissionsStatus: user.admissionsStatus,
    barNumber: user.barNumber, // 10495: Note that this field was previously all upper-case
    birthYear: user.birthYear,
    confirmEmail: user.confirmEmail,
    firmName: user.firmName,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    originalBarState: user.originalBarState,
    practitionerId: user.practitionerId,
    practiceType: user.practiceType,
    practitionerNotes: user.practitionerNotes,
    practitionerType: user.practitionerType,
    representing: user.representing,
    serviceIndicator: user.serviceIndicator,
    suffix: user.suffix,
    updatedEmail: user.updatedEmail,
    userId: user.userId,
    address1: user.address1,
    address2: user.address2,
    address3: user.address3,
    city: user.city,
    country: user.country,
    countryType: user.countryType,
    email: user.email, // 10495: Note that this field was previously trimmed and all lower-case
    isUpdatingInformation: user.isUpdatingInformation, // 10495 TODO: is this needed?
    name: user.name, // 10495: Note that this field was previously all upper-case
    phone: user.phone,
    postalCode: user.postalCode,
    role: user.role,
    section: user.section,
    state: user.state,
  };
}

export function toKyselyUpdatePractitioner(
  user: RawUser,
): UpdatePractitionerKysely {
  return pickPractitionerFields(user);
}

export function toKyselyUpdatePractitioners(
  users: RawUser[],
): UpdatePractitionerKysely[] {
  return users.map(pickPractitionerFields);
}

export function toKyselyNewPractitioner(user: RawUser): NewPractitionerKysely {
  return pickPractitionerFields(user);
}

export function practitionerEntity(practitioner): Practitioner {
  return new Practitioner(
    transformNullToUndefined({
      ...practitioner,
      contact: contactInfo(practitioner),
      admissionsDate: formatDateString(
        practitioner.admissionsDate?.toISOString(),
        FORMATS.YYYYMMDD,
      ),
      pendingEmailVerificationTokenTimestamp:
        practitioner.pendingEmailVerificationTokenTimestamp?.toISOString(),
    }),
  );
}

export function irsPractitionerEntity(practitioner): IrsPractitioner {
  return new IrsPractitioner(
    transformNullToUndefined({
      ...practitioner,
      contact: contactInfo(practitioner),
      admissionsDate: formatDateString(
        practitioner.admissionsDate?.toISOString(),
        FORMATS.YYYYMMDD,
      ),
      pendingEmailVerificationTokenTimestamp:
        practitioner.pendingEmailVerificationTokenTimestamp?.toISOString(),
    }),
  );
}

export function privatePractitioner(practitioner): PrivatePractitioner {
  return new PrivatePractitioner(
    transformNullToUndefined({
      ...practitioner,
      contact: contactInfo(practitioner),
      admissionsDate: formatDateString(
        practitioner.admissionsDate?.toISOString(),
        FORMATS.YYYYMMDD,
      ),
      pendingEmailVerificationTokenTimestamp:
        practitioner.pendingEmailVerificationTokenTimestamp?.toISOString(),
    }),
  );
}

export const PRACTITIONER_ONLY_FIELDS = [
  'additionalPhone',
  'admissionsDate',
  'admissionsStatus',
  'barNumber',
  'birthYear',
  'confirmEmail',
  'practiceType',
  'firmName',
  'firstName',
  'lastName',
  'middleName',
  'originalBarState',
  'practitionerNotes',
  'practitionerType',
  'serviceIndicator',
  'suffix',
  'updatedEmail',
] as typeof DW_PRACTITIONER_COLUMNS;
