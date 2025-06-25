import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { NewUserKysely } from '@web-api/persistence/postgres/users/schema';

function pickUserFields(
  user: RawUser | RawIrsPractitioner | RawPractitioner,
): NewUserKysely {
  // this is questionable
  const rawPractitioner = user as RawPractitioner;

  return {
    userId: user.userId,
    contact: user.contact ? JSON.stringify(user.contact) : null,
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
    role: user.role,
    section: user.section,
    token: user.token,
    // this is questionable
    additionalPhone: rawPractitioner.additionalPhone,
    admissionsDate: rawPractitioner.admissionsDate,
    admissionsStatus: rawPractitioner.admissionsStatus,
    barNumber: rawPractitioner.barNumber,
    birthYear: parseInt(rawPractitioner.birthYear),
    confirmEmail: rawPractitioner.confirmEmail,
    practiceType: rawPractitioner.practiceType,
    firmName: rawPractitioner.firmName,
    firstName: rawPractitioner.firstName,
    lastName: rawPractitioner.lastName,
    middleName: rawPractitioner.middleName,
    originalBarState: rawPractitioner.originalBarState,
    practitionerNotes: rawPractitioner.practitionerNotes,
    practitionerType: rawPractitioner.practitionerType,
    suffix: rawPractitioner.suffix,
    updatedEmail: rawPractitioner.updatedEmail,
  };
}

export function toKyselyNewUser(user: RawUser): NewUserKysely {
  return pickUserFields(user);
}
