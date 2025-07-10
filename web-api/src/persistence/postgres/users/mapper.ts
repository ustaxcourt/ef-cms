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
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

function pickUserFields(
  user: RawUser | RawIrsPractitioner | RawPractitioner,
): NewUserKysely {
  //TODO 10495: this is questionable
  const rawPractitioner = user as RawPractitioner;

  return {
    userId: user.userId,
    contact: user.contact ? JSON.stringify(user.contact) : null,
    email: user.email, // 10495: Note that this field was previously trimmed and all lower-case
    isSeniorJudge: user.isSeniorJudge ?? null,
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
    role: user.role,
    section: user.section,
    token: user.token,
    // this is questionable
    additionalPhone: rawPractitioner.additionalPhone ?? null,
    admissionsDate: rawPractitioner.admissionsDate
      ? calculateDate({
          dateString: rawPractitioner.admissionsDate,
        })
      : null,
    admissionsStatus: rawPractitioner.admissionsStatus ?? null,
    barNumber: rawPractitioner.barNumber || null,
    birthYear: rawPractitioner.birthYear
      ? parseInt(rawPractitioner.birthYear)
      : null,
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

export function fromKyselyPractitioner(
  practitioner: UserKysely,
): RawPractitioner {
  return transformNullToUndefined({
    ...practitioner,
    admissionsDate: formatDateString(
      practitioner.admissionsDate?.toISOString(),
      FORMATS.YYYYMMDD,
    ),
  }) as any;
}

// TODO: 10495 potentially rewrite to have less validation errors
export function rawUser(user: UserKysely) {
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
