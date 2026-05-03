#!/usr/bin/env -S npx ts-node --transpile-only

import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';

const scriptConfig: ScriptConfig = {
  description:
    'lookup-user - Looks up users and roles in a deployed DAWSON environment.',
  environment: {
    environmentName: 'ENV',
  },
  parameters: {
    role: {
      position: 0,
      required: true,
      type: 'string',
    },
    userName: {
      position: 1,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { role, userName } = parseArgsAndEnvVars(scriptConfig) as {
  role: string;
  userName: string;
};

const lookupUsers = async (): Promise<{ [k: string]: string }[]> => {
  const results = (
    await getDbReader(reader => {
      let query = reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        .where('u.role', '=', ROLES[role]);
      if (userName) {
        if (userName.includes(' ')) {
          query = query.where(eb =>
            eb.and(
              userName
                .split(' ')
                .map(term => eb('u.name', 'ilike', `%${term}%`)),
            ),
          );
        } else {
          query = query.where('u.name', 'ilike', `%${userName}%`);
        }
      }
      return query.selectAll('u').execute();
    })
  ).map(fromKyselyUser) as RawUser[];

  return results.map((hit: RawUser) => ({
    Email: hit.email || '',
    Name: hit.name,
    Role: hit.role,
    UserId: hit.userId,
  }));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const users = await lookupUsers();
  console.table(users);
})();
