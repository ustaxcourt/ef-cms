import { RawUser, User } from '@shared/business/entities/User';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { NewUserKysely, UpdateUserKysely } from './schema';
import { Practitioner } from '@shared/business/entities/Practitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';

// 10495 TODO: Is this function necessary for User? If so, it needs to be completed.
function pickFields(user) {
  return {
    name: user.name,
    role: user.role,
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
  const { userType } = user;
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

  if (userType !== 'User') return userEntitySubset(user, userContactInfo);

  return new User(
    transformNullToUndefined({
      ...user,
      contact: userContactInfo,
      admissionsDate: user.admissionsDate?.toISOString(),
      pendingEmailVerificationTokenTimestamp:
        user.pendingEmailVerificationTokenTimestamp?.toISOString(),
    }),
  );
}

// 10495: Implement this function
function userEntitySubset(user, userContactInfo) {
  if (user.entityName === Practitioner.ENTITY_NAME) {
    // instantiate and return a Petitioner
  }

  if (user.entityName === PrivatePractitioner.ENTITY_NAME) {
    // instantiate and return a PrivatePractitioner
  }

  if (user.entityName === IrsPractitioner.ENTITY_NAME) {
    // instantiate and return a IrsPractitioner
  }
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
