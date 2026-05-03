#!/usr/bin/env -S npx ts-node --transpile-only

import {
  CLOSED_CASE_STATUSES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

const scriptConfig: ScriptConfig = {
  description:
    "practitioners-email-in-cases - Lists the email address defined in each of a practitioner's cases",
  environment: {
    environmentName: 'ENV',
  },
  parameters: {
    includeClosed: {
      long: 'include-closed',
      short: 'c',
      type: 'boolean',
    },
    practitionerId: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { includeClosed, practitionerId } = parseArgsAndEnvVars(scriptConfig) as {
  includeClosed: boolean;
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
}): Promise<{ [docketNumber: string]: string }> => {
  const practitionersCases = (await getDbReader(reader => {
    let query = reader
      .selectFrom('dwCase as c')
      .innerJoin('dwUserOnCase as uc', 'c.docketNumber', 'uc.docketNumber')
      .innerJoin('dwUser as u', 'uc.userId', 'u.userId')
      .select(['c.docketNumber', 'u.email']);
    if (!includeClosed) {
      query = query.where('c.status', 'not in', CLOSED_CASE_STATUSES);
    }
    return query
      .where('uc.userId', '=', userId)
      .where('uc.actingAsRole', '=', ROLES[role])
      .orderBy('c.sortableDocketNumber', 'asc')
      .execute();
  })) as { docketNumber: string; email: string }[];

  const practitionersEmailInCases = {};
  for (const pc of practitionersCases) {
    practitionersEmailInCases[pc.docketNumber] = pc.email;
  }
  return practitionersEmailInCases;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const role = await getUsersRole({ userId: practitionerId });
  if (role !== 'irsPractitioner' && role !== 'privatePractitioner') {
    console.log(`Error: user is not a practitioner! User's role: ${role}`);
    return;
  }
  const practitionersEmailInCases = await getPractitionersCases({
    role,
    userId: practitionerId,
  });
  console.log(practitionersEmailInCases);
})();
