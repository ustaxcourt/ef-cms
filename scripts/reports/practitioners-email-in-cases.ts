#!/usr/bin/env -S npx ts-node --transpile-only

import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

const scriptConfig: ScriptConfig = {
  description:
    "practitioners-email-in-cases - Lists the email address defined in each of a practitioner's cases",
  environment: {
    environmentName: 'ENV',
  },
  parameters: {
    practitionerId: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { practitionerId } = parseArgsAndEnvVars(scriptConfig) as {
  practitionerId: string;
};

const getUsersRole = async ({
  userId,
}: {
  userId: string;
}): Promise<string | undefined> => {
  const result = await getUserById({ userId });
  return result?.role;
};

const getPractitionersCases = async ({
  role,
  userId,
}: {
  role: string;
  userId: string;
}): Promise<RawCase[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwCase as c')
        .leftJoin('dwUserOnCase as uc', 'c.docketNumber', 'uc.docketNumber')
        .selectAll('c')
        .where('uc.userId', '=', userId)
        .where('uc.actingAsRole', '=', ROLES[role])
        .orderBy('c.sortableDocketNumber', 'asc')
        .execute(),
    )
  ).map(fromKyselyCase) as RawCase[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const role = await getUsersRole({ userId: practitionerId });
  if (role !== 'irsPractitioner' && role !== 'privatePractitioner') {
    console.log(`Error: user is not a practitioner! User's role: ${role}`);
    return;
  }
  const practitionersCases: RawCase[] = await getPractitionersCases({
    role,
    userId: practitionerId,
  });
  const practitionersEmailInCases = {};
  for (const practitionersCase of practitionersCases) {
    const practitionerObj = practitionersCase[`${role}s`]?.find(
      pract => pract.userId === practitionerId,
    );
    if (practitionerObj && practitionerObj.email) {
      practitionersEmailInCases[practitionersCase.docketNumber] =
        practitionerObj.email;
    }
  }
  console.log(practitionersEmailInCases);
})();
