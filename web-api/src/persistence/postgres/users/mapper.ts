import { RawUser, User } from '@shared/business/entities/User';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import {
  NewPractitionerKysely,
  NewUserKysely,
  UpdatePractitionerKysely,
  UpdateUserKysely,
} from './schema';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

function pickUserFields(user) {
  return {
    address1: user.address1,
    address2: user.address2,
    address3: user.address3,
    city: user.city,
    country: user.country,
    countryType: user.countryType,
    email: user.email, // 10495: Note that this field was previously trimmed and all lower-case
    isSeniorJudge: user.isSeniorJudge,
    isUpdatingInformation: user.isUpdatingInformation,
    judgeFullName: user.judgeFullName,
    judgePhoneNumber: user.judgePhoneNumber,
    judgeTitle: user.judgeTitle,
    name: user.name, // 10495: Note that this field was previously all upper-case
    pendingEmail: user.pendingEmail,
    pendingEmailVerificationToken: user.pendingEmailVerificationToken,
    pendingEmailVerificationTokenTimestamp:
      user.pendingEmailVerificationTokenTimestamp,
    phone: user.phone,
    postalCode: user.postalCode,
    role: user.role,
    section: user.section,
    state: user.state,
    token: user.token,
    userId: user.userId,
    userType: user.userType,
  };
}

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
  };
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

export function toKyselyNewMessages(users: RawUser[]): NewUserKysely[] {
  return users.map(pickUserFields);
}

export function userEntity(user) {
  const userContactInfo = userHasContactInfo(user)
    ? {
        address1: user?.address1,
        address2: user?.address2,
        address3: user?.address3,
        city: user?.city,
        country: user?.country,
        countryType: user?.countryType,
        phone: user?.phone,
        postalCode: user?.postalCode,
        state: user?.state,
      }
    : undefined;

  return userEntitySubset(user, userContactInfo);
}

// 10495: key off of role instead of userType because userType will never be 'IrsPractitioner' or 'PrivatePractitioner'
function userEntitySubset(user, userContactInfo) {
  if (user.userType === Practitioner.ENTITY_NAME) {
    return new Practitioner(
      transformNullToUndefined({
        ...user,
        contact: userContactInfo,
        admissionsDate: formatDateString(
          user.admissionsDate?.toISOString(),
          FORMATS.YYYYMMDD,
        ),
        pendingEmailVerificationTokenTimestamp:
          user.pendingEmailVerificationTokenTimestamp?.toISOString(),
      }),
    );
  }

  if (user.userType === PrivatePractitioner.ENTITY_NAME) {
    return new PrivatePractitioner(
      transformNullToUndefined({
        ...user,
        contact: userContactInfo,
        admissionsDate: formatDateString(
          user.admissionsDate?.toISOString(),
          FORMATS.YYYYMMDD,
        ),
        pendingEmailVerificationTokenTimestamp:
          user.pendingEmailVerificationTokenTimestamp?.toISOString(),
      }),
    );
  }

  if (user.userType === IrsPractitioner.ENTITY_NAME) {
    return new IrsPractitioner(
      transformNullToUndefined({
        ...user,
        contact: userContactInfo,
        admissionsDate: formatDateString(
          user.admissionsDate?.toISOString(),
          FORMATS.YYYYMMDD,
        ),
        pendingEmailVerificationTokenTimestamp:
          user.pendingEmailVerificationTokenTimestamp?.toISOString(),
      }),
    );
  }

  return new User(
    transformNullToUndefined({
      ...user,
      contact: userContactInfo,
      admissionsDate: formatDateString(
        user.admissionsDate?.toISOString(),
        FORMATS.YYYYMMDD,
      ),
      pendingEmailVerificationTokenTimestamp:
        user.pendingEmailVerificationTokenTimestamp?.toISOString(),
    }),
  );
}

function userHasContactInfo(user): boolean {
  return (
    user.address1 &&
    user.city &&
    user.country &&
    user.countryType &&
    user.phone &&
    user.postalCode &&
    user.state
  );
}

export function toKyselyNewUsers(users: RawUser[]): NewUserKysely[] {
  return users.map(pickUserFields);
}
