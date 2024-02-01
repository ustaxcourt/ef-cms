// usage: npx ts-node --transpile-only scripts/judgeUpdates/update-judge-isSeniorJudge.ts

import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { createApplicationContext } from '@web-api/applicationContext';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { search } from '@web-api/persistence/elasticsearch/searchClient';

requireEnvVars([
  'DYNAMODB_TABLE_NAME',
  'ELASTICSEARCH_ENDPOINT',
  'ENV',
  'REGION',
]);

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
  applicationContext: IApplicationContext;
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

  for (let judge of judgesToUpdateIds) {
    const { userId } = judge;

    const userToUpdate = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId });
    const userEntity = new User(userToUpdate);
    userEntity.isSeniorJudge = judge.isSeniorJudge;

    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });
  }
})();
