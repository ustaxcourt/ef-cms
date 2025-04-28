import { getUserByEmail } from './cognito/cognito-helpers';
import { getPractitionerById } from '@web-api/persistence/postgres/practitioners/getPractitionerById';

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
  const practitioner = await getPractitionerById({ userId });
  const practitionerCaseRecordEmail = practitioner.email;

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
