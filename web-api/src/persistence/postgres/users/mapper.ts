import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawUser } from '@shared/business/entities/User';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { NewUserKysely } from '@web-api/persistence/postgres/users/schema';

function pickUserFields(user: RawUser | RawIrsPractitioner): NewUserKysely {
  return {
    // additionalPhone: 'additionalPhone' in user ? user.additionalPhone : null,
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
    userId: user.userId,
  };
}

export function toKyselyNewUser(user: RawUser): NewUserKysely {
  return pickUserFields(user);
}
