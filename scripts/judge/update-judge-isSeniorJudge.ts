#!/usr/bin/env -S npx ts-node --transpile-only

import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawUser, User } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

const scriptConfig: ScriptConfig = {
  description:
    "update-judge-isSeniorJudge - Sets Judges' isSeniorJudge attribute",
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

// WARNING: this list is subject to change! check https://www.ustaxcourt.gov/judges.html
const seniorJudges = [
  'Cohen',
  'Foley',
  'Goeke',
  'Gustafson',
  'Halpern',
  'Holmes',
  'Lauber',
  'Marvel',
  'Morrison',
  'Paris',
  'Thornton',
  'Vasquez',
];

const getJudges = async () => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        .where('u.role', 'in', [ROLES.judge, ROLES.legacyJudge])
        .orderBy('u.lastName', 'asc')
        .execute(),
    )
  ).map(fromKyselyUser) as RawUser[];
};

let judgesToUpdateIds: { userId: string; isSeniorJudge: boolean }[];

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const allJudges = await getJudges();
  judgesToUpdateIds = allJudges.map(
    (judge: { name: string; userId: string }) => ({
      isSeniorJudge: seniorJudges.includes(judge.name),
      userId: judge.userId,
    }),
  );

  for (const judge of judgesToUpdateIds) {
    const { userId } = judge;

    const userToUpdate = await getUserById({ userId });
    const userEntity = new User(userToUpdate);
    userEntity.isSeniorJudge = judge.isSeniorJudge;

    await upsertUsers([userEntity.validate().toRawObject()]);
  }
})();
