import { RawUser, User } from '@shared/business/entities/User';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { NewUserKysely, UpdateUserKysely } from './schema';
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
    entityName: user.entityName,
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

export function toKyselyNewMessages(users: RawUser[]): NewUserKysely[] {
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
    contact.country &&
    contact.countryType &&
    contact.phone &&
    contact.postalCode &&
    contact.state
  );
}

export function toKyselyNewUsers(users: RawUser[]): NewUserKysely[] {
  return users.map(pickUserFields);
}
