import { getUserByEmail } from './cognito/cognito-helpers';
import { getPractitionerEmailById } from './postgres/postgres-helpers';

export async function waitForPractitionerEmailUpdate({
  attempts = 0,
  docketNumber,
  practitionerEmail,
}: {
  docketNumber: string;
  practitionerEmail: string;
  attempts?: number;
}): Promise<boolean> {
  const maxAttempts = 10;
  const { userId } = await getUserByEmail(practitionerEmail);
  const practitionerCaseRecordEmail = await getPractitionerEmailById({
    userId,
  });

  if (practitionerCaseRecordEmail === practitionerEmail) {
    return true;
  }

  if (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    return waitForPractitionerEmailUpdate({
      attempts: attempts + 1,
      docketNumber,
      practitionerEmail,
    });
  } else {
    return false;
  }
}
