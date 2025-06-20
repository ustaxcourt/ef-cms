import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawUser } from '@shared/business/entities/User';
import {
  calculateDate,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  NewPractitionerKysely,
  PractitionerKysely,
  UpdatePractitionerKysely,
} from '@web-api/persistence/postgres/practitioners/schema';
import { contactInfo } from '@web-api/persistence/postgres/users/mapper';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { DW_PRACTITIONER_COLUMNS } from '@web-api/persistence/postgres/practitioners/schema';
import { DW_USER_COLUMNS } from '@web-api/persistence/postgres/users/schema';

// eslint-disable-next-line complexity
export function pickPractitionerFields(
  user: RawPractitioner,
): PractitionerKysely {
  return {
    additionalPhone: user.additionalPhone || null,
    address1: user.contact?.address1 || null,
    address2: user.contact?.address2 || null,
    address3: user.contact?.address3 || null,
    admissionsDate: calculateDate({ dateString: user.admissionsDate }),
    admissionsStatus: user.admissionsStatus,
    barNumber: user.barNumber, // 10495: Note that this field was previously all upper-case
    birthYear: Number(user.birthYear),
    city: user.contact?.city || null,
    confirmEmail: user.confirmEmail || null,
    country: user.contact?.country || null,
    countryType: user.contact?.countryType || null,
    email: user.email || null, // 10495: Note that this field was previously trimmed and all lower-case
    firmName: user.firmName || null,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName || null,
    name: user.name, // 10495: Note that this field was previously all upper-case
    originalBarState: user.originalBarState,
    phone: user.contact?.phone || null,
    postalCode: user.contact?.postalCode || null,
    practiceType: user.practiceType,
    practitionerId: user.practitionerId,
    practitionerNotes: user.practitionerNotes || null,
    practitionerType: user.practitionerType,
    role: user.role,
    section: user.section || null,
    serviceIndicator: user.serviceIndicator,
    state: user.contact?.state || null,
    suffix: user.suffix || null,
    updatedEmail: user.updatedEmail || null,
    userId: user.userId,
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

export function toKyselyNewPractitioners(
  users: RawUser[],
): NewPractitionerKysely[] {
  return users.map(pickPractitionerFields);
}

export function toKyselyNewPractitioner(user: RawUser): NewPractitionerKysely {
  return pickPractitionerFields(user);
}

export function practitionerEntity(practitioner): Practitioner {
  return new Practitioner(transformPractitionerData(practitioner));
}

export function irsPractitionerEntity(practitioner): IrsPractitioner {
  return new IrsPractitioner(transformPractitionerData(practitioner));
}

export function privatePractitionerEntity(practitioner): PrivatePractitioner {
  return new PrivatePractitioner(transformPractitionerData(practitioner));
}

function transformPractitionerData(practitioner) {
  return transformNullToUndefined({
    ...practitioner,
    contact: contactInfo(practitioner),
    admissionsDate: formatDateString(
      practitioner.admissionsDate?.toISOString(),
      FORMATS.YYYYMMDD,
    ),
  });
}

export const PRACTITIONER_ONLY_FIELDS = DW_PRACTITIONER_COLUMNS.filter(
  x => !(DW_USER_COLUMNS as string[]).includes(x),
);
