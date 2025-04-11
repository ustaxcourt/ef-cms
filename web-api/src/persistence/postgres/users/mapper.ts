import { RawUser, User } from '@shared/business/entities/User';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { NewUserKysely, UpdateUserKysely } from './schema';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

function pickFields(user) {
  return {
    additionalPhone: user.additionalPhone,
    address1: user.address1,
    address2: user.address2,
    address3: user.address3,
    admissionsDate: user.admissionsDate,
    admissionsStatus: user.admissionsStatus,
    barNumber: user.barNumber, // 10495: Note that this field was previously all upper-case
    birthYear: user.birthYear,
    city: user.city,
    confirmEmail: user.confirmEmail,
    country: user.country,
    countryType: user.countryType,
    email: user.email, // 10495: Note that this field was previously trimmed and all lower-case
    firmName: user.firmName,
    firstName: user.firstName,
    isSeniorJudge: user.isSeniorJudge,
    isUpdatingInformation: user.isUpdatingInformation,
    judgeFullName: user.judgeFullName,
    judgePhoneNumber: user.judgePhoneNumber,
    judgeTitle: user.judgeTitle,
    lastName: user.lastName,
    middleName: user.middleName,
    name: user.name, // 10495: Note that this field was previously all upper-case
    originalBarState: user.originalBarState,
    pendingEmail: user.pendingEmail,
    pendingEmailVerificationToken: user.pendingEmailVerificationToken,
    pendingEmailVerificationTokenTimestamp:
      user.pendingEmailVerificationTokenTimestamp,
    phone: user.phone,
    postalCode: user.postalCode,
    practiceType: user.practiceType,
    practitionerNotes: user.practitionerNotes,
    practitionerType: user.practitionerType,
    representing: user.representing,
    role: user.role,
    section: user.section,
    serviceIndicator: user.serviceIndicator,
    state: user.state,
    suffix: user.suffix,
    token: user.token,
    updatedEmail: user.updatedEmail,
    userId: user.userId,
    userType: user.userType,
  };
}

export function toKyselyUpdateUser(user: RawUser): UpdateUserKysely {
  return pickFields(user);
}

export function toKyselyUpdateUsers(users: RawUser[]): UpdateUserKysely[] {
  return users.map(pickFields);
}

export function toKyselyNewUser(user: RawUser): NewUserKysely {
  return pickFields(user);
}

export function toKyselyNewMessages(users: RawUser[]): NewUserKysely[] {
  return users.map(pickFields);
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
  return users.map(pickFields);
}
