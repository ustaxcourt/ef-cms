/* eslint-disable complexity */
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';
import {
  calculateDate,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  NewUserKysely,
  UserKysely,
} from '@web-api/persistence/postgres/users/schema';
import {
  ReplaceNullWithUndefined,
  transformNullToUndefined,
} from '@web-api/persistence/postgres/utils/transformNullToUndefined';

function pickUserFields(
  user: RawUser | RawIrsPractitioner | RawPractitioner,
): NewUserKysely {
  const rawPractitioner = user as RawPractitioner;

  return {
    userId: user.userId,
    contact: user.contact ? JSON.stringify(user.contact) : null,
    email: user.email,
    isSeniorJudge: user.isSeniorJudge ?? null,
    isUpdatingInformation: user.isUpdatingInformation,
    judgeFullName: user.judgeFullName,
    judgePhoneNumber: user.judgePhoneNumber,
    judgeTitle: user.judgeTitle,
    name: user.name,
    pendingEmail: user.pendingEmail ?? null,
    pendingEmailVerificationToken: user.pendingEmailVerificationToken ?? null,
    pendingEmailVerificationTokenTimestamp:
      user.pendingEmailVerificationTokenTimestamp
        ? calculateDate({
          dateString: user.pendingEmailVerificationTokenTimestamp,
        })
        : null,
    role: user.role,
    section: user.section,
    token: user.token,
    accountStatus: user.accountStatus,
    additionalPhone: rawPractitioner.additionalPhone ?? null,
    admissionsDate: rawPractitioner.admissionsDate
      ? calculateDate({
        dateString: rawPractitioner.admissionsDate,
      })
      : null,
    admissionsStatus: rawPractitioner.admissionsStatus ?? null,
    barNumber: rawPractitioner.barNumber || null,
    birthYear: rawPractitioner.birthYear ? +rawPractitioner.birthYear : null, //Some birthYears are strings in dynamo. Need to convert to num before storing.
    confirmEmail: rawPractitioner.confirmEmail ?? null,
    practiceType: rawPractitioner.practiceType ?? null,
    firmName: rawPractitioner.firmName ?? null,
    firstName: rawPractitioner.firstName ?? null,
    lastName: rawPractitioner.lastName ?? null,
    middleName: rawPractitioner.middleName ?? null,
    originalBarState: rawPractitioner.originalBarState ?? null,
    practitionerNotes: rawPractitioner.practitionerNotes ?? null,
    practitionerType: rawPractitioner.practitionerType ?? null,
    suffix: rawPractitioner.suffix ?? null,
    updatedEmail: rawPractitioner.updatedEmail ?? null,
  };
}

export function fromKyselyUser(user: UserKysely) {
  return transformNullToUndefined({
    ...user,
    admissionsDate: user.admissionsDate
      ? formatDateString(user.admissionsDate?.toISOString(), FORMATS.YYYYMMDD)
      : null,
    pendingEmailVerificationTokenTimestamp:
      user.pendingEmailVerificationTokenTimestamp?.toISOString(),
  });
}

export function toKyselyNewUser(user: RawUser): NewUserKysely {
  return pickUserFields(user);
}

/*
 This type is not ideal and should not be used outside of persistence functions.
 Ideally our persistence functions should be returning business entities (RawMessage, RawUser, RawDocketEntry...), 
 however in order to match parity in dynamo and not lie about our types we needed to return exactly what's in the table.
*/
export type DbUser = ReplaceNullWithUndefined<
  Omit<
    UserKysely,
    'admissionsDate' | 'pendingEmailVerificationTokenTimestamp'
  > & {
    admissionsDate?: string;
    pendingEmailVerificationTokenTimestamp?: string;
  }
>;
