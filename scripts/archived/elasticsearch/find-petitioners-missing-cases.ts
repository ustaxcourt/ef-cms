#!/usr/bin/env -S npx ts-node --transpile-only

import { type RawUser } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { chunk, isObject } from 'lodash';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

const scriptConfig: ScriptConfig = {
  description:
    'find-petitioners-missing-cases - Identifies cases from which petitioners are missing.',
  environment: {
    dynamoDbTableName: 'DYNAMODB_TABLE_NAME',
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);
const CHUNK_SIZE = 100;

const queryForPetitioners = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
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
  applicationContext: ServerApplicationContext;
  user: RawUser;
}): Promise<void> => {
  const documentClient =
    applicationContext.getDocumentClient();
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

  if (userCases && userCases.length > 0) {
    await Promise.all(
      userCases.map(async theUserCase => {
        const theCase: RawCase = (await documentClient
          .get({
            Key: {
              pk: `case|${theUserCase.docketNumber}`,
              sk: `case|${theUserCase.docketNumber}`,
            },
            TableName: applicationContext.environment.dynamoDbTableName,
          })
          .then(({ Item }) => Item)) as unknown as RawCase;

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
  }
};

(async () => {
  const applicationContext = createApplicationContext({});

  const users = await queryForPetitioners({ applicationContext });

  const userChunks = chunk(users, CHUNK_SIZE);
  let i = 0;
  console.log(
    `processing ${userChunks.length} chunks of users with each chunk being ${CHUNK_SIZE}`,
  );
  for (const userChunk of userChunks) {
    console.log(`processing chunk ${i++} of ${userChunks.length}`);
    await Promise.all(
      userChunk.map(user => checkUser({ applicationContext, user })),
    );
  }
})();
