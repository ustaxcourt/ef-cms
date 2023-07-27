import { requireEnvVars } from '../util';
requireEnvVars([
  'DEFAULT_ACCOUNT_PASS',
  'ELASTICSEARCH_ENDPOINT',
  'ENV',
  'REGION',
]);
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDB } from 'aws-sdk';
import { MAX_SEARCH_CLIENT_RESULTS } from '../../src/business/entities/EntityConstants';
import { createApplicationContext } from '../../../web-api/src/applicationContext';
import { getUserPoolId, getVersion } from '../util';
import { search } from '../../src/persistence/elasticsearch/searchClient';

const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
const dynamo = new DynamoDB({ region: process.env.REGION });

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
const createOrUpdateCognitoUser = async ({
  email,
  name,
  role,
  userId,
  userPoolId,
}) => {
  let userExists = false;
  try {
    await cognito.adminGetUser({
      UserPoolId: userPoolId,
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
      await cognito.adminCreateUser({
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
        UserPoolId: userPoolId,
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
      userPoolId,
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
 * @param {string} name               Judge name
 * @param {string} section            Judge's chambers section
 * @param {string} version            database version
 * @returns {Promise<void>}
 */
const deleteDuplicateImportedJudgeUser = async ({
  bulkImportedUserId,
  name,
  section,
  version,
}) => {
  const TableName = `efcms-${process.env.ENV}-${version}`;

  const sectionMappingKey = {
    pk: { S: `section|${section}` },
    sk: { S: `user|${bulkImportedUserId}` },
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
      `ERROR deleting duplicate chambers section mapping for ${name}:`,
      err,
    );
  }

  const userKey = {
    pk: { S: `user|${bulkImportedUserId}` },
    sk: { S: `user|${bulkImportedUserId}` },
  };
  try {
    await dynamo
      .deleteItem({
        Key: userKey,
        TableName,
      })
      .promise();
  } catch (err) {
    console.error(`ERROR deleting duplicate ${name}:`, err);
  }
  console.log(`Deleted duplicate ${name}`);
};

/**
 * Retrieves all judge users and formats them in an object structure that reveals duplicates
 *
 * @returns {object} object containing all users for each judge
 */

const getJudgeUsersByName = async applicationContext => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
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
    },
  });

  let judgeUsers = {};
  for (const judge of results) {
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
 * @param {string} name               Judge name
 * @returns {Promise<void>}
 */
const updateCognitoUserId = async ({
  bulkImportedUserId,
  gluedUserId,
  name,
  userPoolId,
}) => {
  try {
    await cognito.adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'custom:userId',
          Value: gluedUserId,
        },
      ],
      UserPoolId: userPoolId,
      Username: bulkImportedUserId,
    });
    console.log(`Updated user attributes for login for ${name}`);
  } catch (err) {
    console.error(`ERROR updating custom:userId for ${name}:`, err);
  }
};

(async () => {
  const version = await getVersion();
  const applicationContext = createApplicationContext({});
  const userPoolId = await getUserPoolId();

  const judgeUsers = await getJudgeUsersByName(applicationContext);

  for (const judge in judgeUsers) {
    if (!judgeUsers[judge].gluedUserId) {
      continue;
    }

    const { bulkImportedUserId, email, gluedUserId, name, section } =
      judgeUsers[judge];

    if (bulkImportedUserId) {
      await deleteDuplicateImportedJudgeUser({
        bulkImportedUserId,
        name,
        section,
        version,
      });
    }

    await createOrUpdateCognitoUser({
      email,
      name,
      role: 'judge',
      userId: gluedUserId,
      userPoolId,
    });

    await cognito.adminSetUserPassword({
      Password: process.env.DEFAULT_ACCOUNT_PASS,
      Permanent: true,
      UserPoolId: userPoolId,
      Username: email,
    });
  }
})();
