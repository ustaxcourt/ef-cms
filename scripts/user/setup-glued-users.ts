#!/usr/bin/env -S npx ts-node --transpile-only

import { sql } from 'kysely';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';
import { RawUser } from '@shared/business/entities/User';
import { runInBatches } from '../helpers/batch';

const scriptConfig: ScriptConfig = {
  description:
    'setup-glued-users - Creates cognito accounts for all internal users and high-volume external users that were copied via a glue job.',
  environment: {
    Password: 'DEFAULT_ACCOUNT_PASS',
    UserPoolId: 'USER_POOL_ID',
    region: 'REGION',
  },
  requireActiveAwsSession: true,
};
const { Password, UserPoolId, region } = parseArgsAndEnvVars(scriptConfig) as {
  [k: string]: string;
};

type Users = {
  [key: string]: {
    bulkImportedUserId?: string;
    email: string;
    gluedUserId?: string;
    name: string;
    userFullName: string;
    role: string;
    section: string;
  };
};

const cognito = new CognitoIdentityProvider({ region });

const createOrUpdateCognitoUser = async ({
  email,
  name,
  role,
  userId,
}: {
  email: string;
  name: string;
  role: string;
  userId: string;
}): Promise<void> => {
  if (role === 'legacyJudge') {
    return;
  }

  let userExists = false;
  try {
    await cognito.adminGetUser({
      UserPoolId,
      Username: email,
    });

    userExists = true;
  } catch (_err) {
    console.log(`No cognito user found for ${name}:`);
  }

  if (!userExists) {
    try {
      await cognito.adminCreateUser({
        UserAttributes: [
          {
            Name: 'email_verified',
            Value: 'true',
          },
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'custom:role',
            Value: role,
          },
          {
            Name: 'name',
            Value: name,
          },
          {
            Name: 'custom:userId',
            Value: userId,
          },
        ],
        UserPoolId,
        Username: email,
      });
    } catch (err) {
      console.error(`ERROR creating cognito user for ${name}:`, err);
    }
  } else {
    await updateCognitoUserId({
      bulkImportedUserId: email,
      gluedUserId: userId,
      name,
    });
  }
  console.log(`Enabled login for ${name}`);
};

const deleteDuplicateImportedUser = async ({
  bulkImportedUserId,
  name,
}: {
  bulkImportedUserId: string;
  name: string;
}): Promise<void> => {
  try {
    await pgDeleteFrom({
      table: 'dwUser',
      where: db => db.where('userId', '=', bulkImportedUserId),
    });
  } catch (err) {
    console.error(`ERROR deleting duplicate ${name}:`, err);
  }
  console.log(`Deleted duplicate ${name}`);
};

const getPractitionerUsers = async (): Promise<any[]> => {
  const userIdRows = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase')
      .select('userId')
      .where('actingAsRole', 'in', ['irsPractitioner', 'privatePractitioner'])
      .where('serviceIndicator', '=', 'Electronic')
      .groupBy('userId')
      .having(sql<boolean>`count(*) > ${500}`)
      .execute(),
  );

  const userIds = userIdRows.map(r => r.userId).filter(Boolean) as string[];
  if (!userIds.length) return [];

  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .where('userId', 'in', userIds)
      .where('accountStatus', '=', 'active')
      .selectAll()
      .execute(),
  );

  const dojIrsPractitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .selectAll()
      .where('role', '=', 'irsPractitioner')
      .where('practiceType', '=', 'DOJ')
      .where('accountStatus', '=', 'active')
      .execute(),
  );

  // Merge and deduplicate by userId
  const mergedById = new Map<string, any>();
  for (const user of [...users, ...dojIrsPractitioners]) {
    if (user?.userId) mergedById.set(user.userId, user);
  }

  return Array.from(mergedById.values());
};

const getPetitionerUsers = async (): Promise<any[]> => {
  // fetch users whose user_id appears as a petitioner contactId in dw_case
  const users = await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .selectAll()
      .where(
        'userId',
        'in',
        sql<string>`(
          select p->>'contactId'
          from dw_case
          cross join lateral jsonb_array_elements(petitioners) as p
          group by p->>'contactId'
          having count(*) >= 5
        )`,
      )
      .where('email', 'is not', null)
      .where('accountStatus', '=', 'active')
      .execute(),
  );

  return users as any[];
};

const getInternalUsers = async (): Promise<any> => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .select(['email', 'judgeTitle', 'name', 'role', 'section', 'userId'])
      .orderBy('name')
      .where('role', 'in', [
        'judge',
        'legacyJudge',
        'adc',
        'admissionsclerk',
        'caseServicesSupervisor',
        'chambers',
        'clerkofcourt',
        'docketclerk',
        'floater',
        'general',
        'judge',
        'legacyJudge',
        'petitionsclerk',
        'reportersOffice',
        'trialclerk',
      ])
      .where('accountStatus', '=', 'active')
      .limit(1000)
      .execute(),
  );
};

const getUsers = async (): Promise<Users> => {
  const [internalUsers, practitionerUsers, petitionerUsers] = await Promise.all(
    [getInternalUsers(), getPractitionerUsers(), getPetitionerUsers()],
  );
  console.log(
    `Fetched ${internalUsers.length} internal users, ${practitionerUsers.length} practitioner users, and ${petitionerUsers.length} petitioner users`,
  );
  let results = [...internalUsers, ...practitionerUsers, ...petitionerUsers];

  results = results.filter(result => {
    return result.email?.split('@')[1] !== 'example.com';
  });

  const users = {};
  for (const user of results as RawUser[]) {
    const emailDomain = user.email!.split('@')[1];

    const fullName = user.name;

    if (user.email) {
      if (['judge', 'legacyJudge'].includes(user.role)) {
        users[user.email] = {
          email: `${
            user.judgeTitle!.indexOf('Special Trial') !== -1 ? 'st' : ''
          }judge.${user.name.toLowerCase()}@example.com`,
          name: `${user.judgeTitle} ${fullName}`,
          userFullName: `${fullName}`,
          role: user.role,
          section: user.section,
        };
      } else {
        users[user.email] = {
          email: user.email,
          name: `${user.role} ${fullName}`,
          userFullName: `${fullName}`,
          role: user.role,
          section: user.section,
        };
      }

      let sourceOfUser = emailDomain;
      if (emailDomain === 'ef-cms.ustaxcourt.gov') {
        sourceOfUser = 'gluedUserId';
      } else if (emailDomain === 'dawson.ustaxcourt.gov') {
        sourceOfUser = 'bulkImportedUserId';
      }
      users[user.email][sourceOfUser] = user.userId;
    }
  }
  return users;
};

const updateCognitoUserId = async ({
  bulkImportedUserId,
  gluedUserId,
  name,
}: {
  bulkImportedUserId: string;
  gluedUserId: string;
  name: string;
}): Promise<void> => {
  try {
    await cognito.adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'custom:userId',
          Value: gluedUserId,
        },
      ],
      UserPoolId,
      Username: bulkImportedUserId,
    });
    console.log(`Updated user attributes for login for ${name}`);
  } catch (err) {
    console.error(`ERROR updating custom:userId for ${name}:`, err);
  }
};

const processUser = async (userName: string, users: Users): Promise<void> => {
  if (!users[userName].gluedUserId) {
    return;
  }
  const { bulkImportedUserId, email, gluedUserId, name, role, userFullName } =
    users[userName];
  if (bulkImportedUserId) {
    await deleteDuplicateImportedUser({
      bulkImportedUserId,
      name,
    });
  }
  if (role === 'legacyJudge') return;
  if (gluedUserId) {
    await createOrUpdateCognitoUser({
      email,
      name: userFullName,
      role,
      userId: gluedUserId,
    });
  }
  await cognito.adminSetUserPassword({
    Password,
    Permanent: true,
    UserPoolId,
    Username: email,
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const users = await getUsers();

  // Create task functions so work is started only when invoked
  const tasks: (() => Promise<void>)[] = Object.keys(users).map(
    user => () => processUser(user, users),
  );

  await runInBatches(tasks);
})();
