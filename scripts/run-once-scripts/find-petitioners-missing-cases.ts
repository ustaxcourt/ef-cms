// usage: npx ts-node --transpile-only scripts/run-once-scripts/find-petitioners-missing-cases.ts

import '../../types/IApplicationContext';
import { chunk, isObject } from 'lodash';
import { createApplicationContext } from '../../web-api/src/applicationContext';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { searchAll } from '../../web-api/src/persistence/elasticsearch/searchClient';
import type { RawUser } from '../../shared/src/business/entities/User';

requireEnvVars(['ENV', 'REGION']);

const CHUNK_SIZE = 100;

const queryForPetitioners = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<RawUser[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                terms: {
                  'role.S': ['petitioner'],
                },
              },
            ],
          },
        },
      },
      index: 'efcms-user',
    },
  });

  return results;
};

const checkUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: IApplicationContext;
  user: RawUser;
}): Promise<void> => {
  const documentClient =
    applicationContext.getDocumentClient(applicationContext);
  const { Items: userCases } = await documentClient.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${user.userId}`,
      ':prefix': 'case',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    TableName: applicationContext.environment.dynamoDbTableName,
  });

  await Promise.all(
    userCases.map(async theUserCase => {
      const theCase: RawCase = await documentClient
        .get({
          Key: {
            pk: `case|${theUserCase.docketNumber}`,
            sk: `case|${theUserCase.docketNumber}`,
          },
          TableName: applicationContext.environment.dynamoDbTableName,
        })
        .promise()
        .then(({ Item }) => Item);

      if (theCase.petitioners) {
        const found = theCase.petitioners.find(
          petitioner => petitioner.contactId === user.userId,
        );
        if (!found) {
          console.log(
            `ERROR: user ${user.userId} is associated with ${theCase.docketNumber}, but does not exist on the petitioners array`,
          );
        }
      } else {
        const primaryContactId =
          'contactPrimary' in theCase &&
          isObject(theCase.contactPrimary) &&
          'contactId' in theCase.contactPrimary
            ? theCase.contactPrimary.contactId
            : '';
        const secondaryContactId =
          'contactSecondary' in theCase &&
          isObject(theCase.contactSecondary) &&
          'contactId' in theCase.contactSecondary
            ? theCase.contactSecondary.contactId
            : '';
        if (
          user.userId !== primaryContactId &&
          user.userId !== secondaryContactId
        ) {
          console.log(
            `ERROR: user ${user.userId} is associated with ${theCase.docketNumber}, but does not exist on the contactPrimary / contactSecondary`,
          );
        }
      }
    }),
  );
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const users = await queryForPetitioners({ applicationContext });

  const userChunks = chunk(users, CHUNK_SIZE);
  let i = 0;
  console.log(
    `processing ${userChunks.length} chunks of users with each chunk being ${CHUNK_SIZE}`,
  );
  for (let userChunk of userChunks) {
    console.log(`processing chunk ${i++} of ${userChunks.length}`);
    await Promise.all(
      userChunk.map(user => checkUser({ applicationContext, user })),
    );
  }
})();
