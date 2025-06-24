import { RawUser, User } from '@shared/business/entities/User';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { NewUserKysely, UpdateUserKysely } from './schema';
import {
  calculateDate,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import {
  PrivatePractitioner,
  RawPrivatePractitioner,
} from '@shared/business/entities/PrivatePractitioner';
import {
  IrsPractitioner,
  RawIrsPractitioner,
} from '@shared/business/entities/IrsPractitioner';

function pickUserFields(user: RawUser): NewUserKysely {
  return {
    address1: user.contact?.address1,
    address2: user.contact?.address2,
    address3: user.contact?.address3,
    city: user.contact?.city,
    country: user.contact?.country,
    countryType: user.contact?.countryType,
    email: user.email, // 10495: Note that this field was previously trimmed and all lower-case
    entityName: user.entityName,
    isSeniorJudge: user.isSeniorJudge,
    isUpdatingInformation: user.isUpdatingInformation,
    judgeFullName: user.judgeFullName,
    judgePhoneNumber: user.judgePhoneNumber,
    judgeTitle: user.judgeTitle,
    name: user.name, // 10495: Note that this field was previously all upper-case
    pendingEmail: user.pendingEmail ?? null,
    pendingEmailVerificationToken: user.pendingEmailVerificationToken ?? null,
    pendingEmailVerificationTokenTimestamp:
      user.pendingEmailVerificationTokenTimestamp
        ? calculateDate({
            dateString: user.pendingEmailVerificationTokenTimestamp,
          })
        : null,
    phone: user.contact?.phone,
    postalCode: user.contact?.postalCode,
    role: user.role,
    section: user.section,
    state: user.contact?.state,
    token: user.token,
    userId: user.userId,
  };
}

function pickUserOnCase(record) {
  return {
    userId: record.userId,
    docketNumber: record.docketNumber,
    representing: record.representing
      ? JSON.stringify(record.representing)
      : undefined,
    entityName: record.entityName,
    serviceIndicatorOnCase: record.serviceIndicatorOnCase,
  };
}

export function toKyselyNewUserOnCaseRecords(records) {
  return records.map(pickUserOnCase);
}

export function toKyselyUpdateUser(user: RawUser): UpdateUserKysely {
  return pickUserFields(user);
}

export function toKyselyUpdateUsers(users: RawUser[]): UpdateUserKysely[] {
  return users.map(pickUserFields);
}

export function toKyselyNewUser(user: RawUser): NewUserKysely {
  return pickUserFields(user);
}

export function toKyselyNewUsers(users: RawUser[]): NewUserKysely[] {
  return users.map(pickUserFields);
}

export function contactInfo(contact) {
  return hasContactInfo(contact)
    ? {
        address1: contact?.address1,
        address2: contact?.address2,
        address3: contact?.address3,
        city: contact?.city,
        country: contact?.country,
        countryType: contact?.countryType,
        phone: contact?.phone,
        postalCode: contact?.postalCode,
        state: contact?.state,
      }
    : undefined;
}

export function userEntity(user): User {
  return new User(
    transformNullToUndefined({
      ...user,
      contact: contactInfo(user),
      admissionsDate: formatDateString(
        user.admissionsDate?.toISOString(),
        FORMATS.YYYYMMDD,
      ),
      pendingEmailVerificationTokenTimestamp:
        user.pendingEmailVerificationTokenTimestamp?.toISOString(),
    }),
  );
}

function hasContactInfo(contact): boolean {
  return (
    contact.address1 &&
    contact.city &&
    contact.countryType &&
    contact.phone &&
    contact.postalCode &&
    contact.state
  );
}

export function rawUserWithPractitionerEntity(
  user,
): RawUser | RawPractitioner | RawIrsPractitioner | RawPrivatePractitioner {
  if (user.entityName === PrivatePractitioner.ENTITY_NAME) {
    return new PrivatePractitioner(
      transformNullToUndefined({
        ...user,
        contact: contactInfo(user),
        admissionsDate: formatDateString(
          user.admissionsDate?.toISOString(),
          FORMATS.YYYYMMDD,
        ),
        pendingEmailVerificationTokenTimestamp:
          user.pendingEmailVerificationTokenTimestamp?.toISOString(),
      }),
    )
      .validate()
      .toRawObject();
  } else if (user.entityName === IrsPractitioner.ENTITY_NAME) {
    return new IrsPractitioner(
      transformNullToUndefined({
        ...user,
        contact: contactInfo(user),
        admissionsDate: formatDateString(
          user.admissionsDate?.toISOString(),
          FORMATS.YYYYMMDD,
        ),
        pendingEmailVerificationTokenTimestamp:
          user.pendingEmailVerificationTokenTimestamp?.toISOString(),
      }),
    )
      .validate()
      .toRawObject();
  } else if (user.entityName === Practitioner.ENTITY_NAME) {
    return new Practitioner(
      transformNullToUndefined({
        ...user,
        contact: contactInfo(user),
        admissionsDate: formatDateString(
          user.admissionsDate?.toISOString(),
          FORMATS.YYYYMMDD,
        ),
        pendingEmailVerificationTokenTimestamp:
          user.pendingEmailVerificationTokenTimestamp?.toISOString(),
      }),
    )
      .validate()
      .toRawObject();
  } else {
    return new User(
      transformNullToUndefined({
        ...user,
        contact: contactInfo(user),
        admissionsDate: formatDateString(
          user.admissionsDate?.toISOString(),
          FORMATS.YYYYMMDD,
        ),
        pendingEmailVerificationTokenTimestamp:
          user.pendingEmailVerificationTokenTimestamp?.toISOString(),
      }),
    )
      .validate()
      .toRawObject();
  }
}
