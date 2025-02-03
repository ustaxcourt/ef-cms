#!/usr/bin/env -S npx ts-node --transpile-only

import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws-v3';
import { Client } from '@opensearch-project/opensearch';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  SearchClientResultsType,
  formatResults,
} from '@web-api/persistence/elasticsearch/searchClient';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

const scriptConfig: ScriptConfig = {
  description:
    'setup-glued-judges - Creates cognito accounts for Judge users that were copied via a glue job.',
  environment: {
    Password: 'DEFAULT_ACCOUNT_PASS',
    TableName: 'DESTINATION_TABLE',
    UserPoolId: 'USER_POOL_ID',
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { elasticsearchEndpoint, Password, TableName, UserPoolId } =
  parseArgsAndEnvVars(scriptConfig) as { [k: string]: string };

const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
});
const esClient = new Client({
  ...AwsSigv4Signer({
    getCredentials: () => {
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
    region: 'us-east-1',
  }),
  node: `https://${elasticsearchEndpoint}:443`,
});

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
  } catch (err) {
    const { code }: any = err;
    if (code !== 'UserNotFoundException') {
      console.error(`ERROR checking for cognito user for ${name}:`, err);
    }
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
  section,
}: {
  bulkImportedUserId: string;
  name: string;
  section: string;
}): Promise<void> => {
  const sectionMappingKey = {
    pk: { S: `section|${section}` },
    sk: { S: `user|${bulkImportedUserId}` },
  };
  const deleteMappingItemCommand = new DeleteItemCommand({
    Key: sectionMappingKey,
    TableName,
  });
  try {
    await dynamoClient.send(deleteMappingItemCommand);
  } catch (err) {
    console.error(
      `ERROR deleting duplicate chambers section mapping for ${name}:`,
      err,
    );
  }

  const userKey = {
    pk: { S: `user|${bulkImportedUserId}` },
    sk: { S: `user|${bulkImportedUserId}` },
  };
  const deleteUserItemCommand = new DeleteItemCommand({
    Key: userKey,
    TableName,
  });
  try {
    await dynamoClient.send(deleteUserItemCommand);
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
  const queryResults = await esClient.search({
    body: {
      from: 0,
      query: {
        bool: {
          filter: [
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
  });
  const { results }: SearchClientResultsType = formatResults(queryResults.body);

  const judgeUsers = {};
  for (const judge of results) {
    const emailDomain = judge.email.split('@')[1];
    if (!(judge.name in judgeUsers)) {
      judgeUsers[judge.name] = {
        email: `${
          judge.judgeTitle.indexOf('Special Trial') !== -1 ? 'st' : ''
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

    const { bulkImportedUserId, email, gluedUserId, name, role, section } =
      judgeUsers[judge];

    if (bulkImportedUserId) {
      await deleteDuplicateImportedJudgeUser({
        bulkImportedUserId,
        name,
        section,
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
