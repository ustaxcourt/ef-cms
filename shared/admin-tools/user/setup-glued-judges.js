if (
  !process.env.ELASTICSEARCH_ENDPOINT ||
  !process.env.ENV ||
  !process.env.REGION
) {
  console.error(
    'Required environment variables: COGNITO_USER_POOL, ELASTICSEARCH_ENDPOINT, ENV, REGION',
  );
  process.exit();
}

const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const {
  MAX_SEARCH_CLIENT_RESULTS,
} = require('../../src/business/entities/EntityConstants');
const { Config, DynamoDB, EnvironmentCredentials } = require('aws-sdk');
const { getVersion } = require('../util');

const { CognitoIdentityServiceProvider } = require('aws-sdk');
const { getUserPoolId } = require('../util');

/**
 * Creates a cognito user
 *
 * @param {object} applicationContext the application context
 * @param {string} email              the cognito user's email address
 * @param {string} name               the cognito user's name
 * @param {string} role               the cognito user's role
 * @param {string} userId             the cognito user's userId
 * @returns {Promise<void>}
 */
const createCognitoUser = async ({ email, name, role, userId }) => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();

  let userExists = false;
  try {
    await cognito.getUser({
      UserPoolId,
      Username: email,
    });

    userExists = true;
  } catch (err) {
    if (err.code !== 'UserNotFoundException') {
      console.error(`ERROR checking for cognito user for ${name}:`, err);
      return;
    }
  }
  if (!userExists) {
    try {
      await cognito
        .adminCreateUser({
          UserAttributes: [
            {
              Name: 'email_verified',
              Value: 'True',
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
        })
        .promise();
    } catch (err) {
      console.error(`ERROR creating cognito user for ${name}:`, err);
    }
  } else {
    // update existing userId
    await updateCognitoUserId({
      bulkImportedUserId: email,
      cognito,
      gluedUserId: userId,
      judge: name,
      userPoolId: UserPoolId,
    });
  }
  console.log(`Enabled login for ${name}`);
};

/**
 * Deletes a judge user and chambers section mapping
 *   - intended to be used only if a judge has both an imported user and a glued user
 *
 * @param {string} bulkImportedUserId bulk imported user id
 * @param {object} dynamo             DynamoDB object
 * @param {string} judge              Judge name
 * @param {string} section            Judge's chambers section
 * @param {string} version            database version
 * @returns {Promise<void>}
 */
const deleteDuplicateImportedJudgeUser = async ({
  bulkImportedUserId,
  dynamo,
  judge,
  section,
  version,
}) => {
  const TableName = `efcms-${process.env.ENV}-${version}`;

  const sectionMappingKey = {
    pk: `section|${section}`,
    sk: `user|${bulkImportedUserId}`,
  };
  try {
    await dynamo
      .deleteItem({
        Key: sectionMappingKey,
        TableName,
      })
      .promise();
  } catch (err) {
    console.error(
      `ERROR deleting duplicate chambers section mapping for Judge ${judge}:`,
      err,
    );
  }

  const userKey = {
    pk: `user|${bulkImportedUserId}`,
    sk: `user|${bulkImportedUserId}`,
  };
  try {
    await dynamo
      .deleteItem({
        Key: userKey,
        TableName,
      })
      .promise();
  } catch (err) {
    console.error(`ERROR deleting duplicate Judge ${judge}:`, err);
  }
  console.log(`Deleted duplicate Judge ${judge}`);
};

/**
 * Retrieves all judge users and formats them in an object structure that reveals duplicates
 *
 * @returns {object} object containing all users for each judge
 */

const getJudgeUsers = async () => {
  const getSearchClient = new elasticsearch.Client({
    amazonES: {
      credentials: new EnvironmentCredentials('AWS'),
      region: process.env.region,
    },
    apiVersion: '7.7',
    awsConfig: new Config({ region: 'us-east-1' }),
    connectionClass,
    host: process.ENV.ELASTICSEARCH_ENDPOINT,
    log: 'warning',
    port: 443,
    protocol: 'https',
  });

  const results = await getSearchClient.search({
    body: {
      from: 0,
      query: {
        bool: {
          must: {
            term: {
              'role.S': {
                value: 'judge',
              },
            },
          },
        },
      },
      size: MAX_SEARCH_CLIENT_RESULTS,
    },
    index: 'efcms-user',
  });

  const judgeUsersFromElasticsearch = results.hits.hits.map(hit => {
    return {
      email: hit['_source']['email'].S,
      entityName: hit['_source']['entityName'].S,
      judgeFullName: hit['_source']['judgeFullName'].S,
      judgeTitle: hit['_source']['judgeTitle'].S,
      name: hit['_source']['name'].S,
      pk: hit['_source']['pk'].S,
      role: hit['_source']['role'].S,
      section: hit['_source']['section'].S,
      sk: hit['_source']['sk'].S,
      userId: hit['_source']['userId'].S,
    };
  });

  let judgeUsers = {};
  for (const judge of judgeUsersFromElasticsearch) {
    const emailDomain = judge.email.split('@')[1];
    if (!(judge.name in judgeUsers)) {
      judgeUsers[judge.name] = {
        email: `${
          judge.judgeTitle.indexOf('Special Trial') !== -1 ? 'st' : ''
        }judge.${judge.name.toLowerCase()}@example.com`,
        name: `${judge.judgeTitle} ${judge.name}`,
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

/**
 * Updates the userId of a cognito user created via bulk import
 *
 * @param {object} applicationContext the application context
 * @param {string} bulkImportedUserId bulk imported user id
 * @param {string} gluedUserId        glued user id
 * @param {string} judge              Judge name
 * @returns {Promise<void>}
 */
const updateCognitoUserId = async ({
  bulkImportedUserId,
  cognito,
  gluedUserId,
  judge,
  userPoolId,
}) => {
  try {
    await cognito
      .adminUpdateUserAttributes({
        UserAttributes: [
          {
            Name: 'custom:userId',
            Value: gluedUserId,
          },
        ],
        UserPoolId: userPoolId,
        Username: bulkImportedUserId,
      })
      .promise();
    console.log(`Enabled login for Judge ${judge}`);
  } catch (err) {
    console.error(`ERROR updating custom:userId for Judge ${judge}:`, err);
  }
};

(async () => {
  const version = await getVersion();
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const dynamo = new DynamoDB({ region: process.env.REGION });
  const UserPoolId = await getUserPoolId();

  const judgeUsers = await getJudgeUsers();

  for (const judge in judgeUsers) {
    const { email, name } = judgeUsers[judge];
    if ('gluedUserId' in judgeUsers[judge]) {
      if ('bulkImportedUserId' in judgeUsers[judge]) {
        const { bulkImportedUserId, gluedUserId, section } = judgeUsers[judge];

        await deleteDuplicateImportedJudgeUser({
          bulkImportedUserId,
          dynamo,
          judge,
          section,
          version,
        });

        await updateCognitoUserId({
          bulkImportedUserId,
          cognito,
          gluedUserId,
          judge,
        });
      } else {
        const userId = judgeUsers[judge]['ef-cms.ustaxcourt.gov'];

        await createCognitoUser({
          email,
          name,
          role: 'judge',
          userId,
        });
      }

      await cognito
        .adminSetUserPassword({
          Password: process.env.DEFAULT_ACCOUNT_PASS,
          Permanent: true,
          UserPoolId,
          Username: email,
        })
        .promise();
    }
  }
})();
