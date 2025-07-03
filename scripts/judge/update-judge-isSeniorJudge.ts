#!/usr/bin/env -S npx ts-node --transpile-only

import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { User } from '@shared/business/entities/User';
import { search } from '@web-api/persistence/elasticsearch/searchClient';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

const scriptConfig: ScriptConfig = {
  description:
    "update-judge-isSeniorJudge - Sets Judges' isSeniorJudge attribute",
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
    region: 'REGION',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

// WARNING: this list is subject to change! check https://www.ustaxcourt.gov/judges.html
const seniorJudges = [
  'Cohen',
  'Colvin',
  'Gale',
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

const getJudges = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}) => {
  return (
    await search({
      applicationContext,
      searchParameters: {
        body: {
          from: 0,
          query: {
            bool: {
              must: [
                {
                  terms: {
                    'role.S': ['judge', 'legacyJudge'],
                  },
                },
              ],
            },
          },
          size: MAX_ELASTICSEARCH_PAGINATION,
        },
        index: 'efcms-user',
      },
    })
  )?.results;
};

let judgesToUpdateIds: { userId: string; isSeniorJudge: boolean }[];

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const allJudges = await getJudges({ applicationContext });
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
