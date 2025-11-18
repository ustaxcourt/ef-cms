#!/usr/bin/env -S npx ts-node --transpile-only

import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';
import { RawUser } from '@shared/business/entities/User';

const scriptConfig: ScriptConfig = {
  description:
    'setup-glued-judges - Creates cognito accounts for Judge users that were copied via a glue job.',
  environment: {
    Password: 'DEFAULT_ACCOUNT_PASS',
    UserPoolId: 'USER_POOL_ID',
  },
  requireActiveAwsSession: true,
};
const { Password, UserPoolId } = parseArgsAndEnvVars(scriptConfig) as {
  [k: string]: string;
};

const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });

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

const deleteDuplicateImportedJudgeUser = async ({
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

const getJudgeUsersByName = async (): Promise<{
  [key: string]: {
    bulkImportedUserId?: string;
    email: string;
    gluedUserId?: string;
    name: string;
    role: string;
    section: string;
  };
}> => {
  const results = await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .select(['email', 'judgeTitle', 'name', 'role', 'section', 'userId'])
      .orderBy('name')
      .where('role', 'in', ['judge', 'legacyJudge'])
      .limit(1000)
      .execute(),
  );

  const judgeUsers = {};
  for (const judge of results as RawUser[]) {
    const emailDomain = judge.email!.split('@')[1];
    if (!(judge.name in judgeUsers)) {
      judgeUsers[judge.name] = {
        email: `${
          judge.judgeTitle!.indexOf('Special Trial') !== -1 ? 'st' : ''
        }judge.${judge.name.toLowerCase()}@example.com`,
        name: `${judge.judgeTitle} ${judge.name}`,
        role: judge.role,
        section: judge.section,
      };
    }

    let sourceOfUser = emailDomain;
    if (emailDomain === 'ef-cms.ustaxcourt.gov') {
      sourceOfUser = 'gluedUserId';
    } else if (
      emailDomain === 'example.com' ||
      emailDomain === 'dawson.ustaxcourt.gov'
    ) {
      sourceOfUser = 'bulkImportedUserId';
    }
    judgeUsers[judge.name][sourceOfUser] = judge.userId;
  }
  return judgeUsers;
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const judgeUsers = await getJudgeUsersByName();

  for (const judge in judgeUsers) {
    if (!judgeUsers[judge].gluedUserId) {
      continue;
    }

    const { bulkImportedUserId, email, gluedUserId, name, role } =
      judgeUsers[judge];

    if (bulkImportedUserId) {
      await deleteDuplicateImportedJudgeUser({
        bulkImportedUserId,
        name,
      });
    }

    if (role === 'legacyJudge') continue;

    if (gluedUserId) {
      await createOrUpdateCognitoUser({
        email,
        name,
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
  }
})();
