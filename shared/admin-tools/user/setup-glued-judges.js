if (
  !process.env.COGNITO_USER_POOL ||
  !process.env.ELASTICSEARCH_ENDPOINT ||
  !process.env.ENV ||
  !process.env.REGION
) {
  console.error(
    'Required environment variables: COGNITO_USER_POOL, ELASTICSEARCH_ENDPOINT, ENV, REGION',
  );
  process.exit();
}

const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  MAX_SEARCH_CLIENT_RESULTS,
} = require('../../src/business/entities/EntityConstants');
const { CognitoIdentityServiceProvider } = require('aws-sdk');
const { DynamoDB } = require('aws-sdk');
const { getVersion } = require('../util');
const { search } = require('../../src/persistence/elasticsearch/searchClient');

/**
 * Deletes a judge user and chambers section mapping
 *   - intended to be used only if a judge has both an imported user and a glued user
 *
 * @param {string} bulkImportedUserId bulk imported user id
 * @param {object} dynamo             DynamoDB object
 * @param {string} judge              Judge name
 * @param {string} version            database version
 * @returns {Promise<void>}
 */
const deleteDuplicateImportedJudgeUser = async ({
  bulkImportedUserId,
  dynamo,
  judge,
  version,
}) => {
  const section = `${judge.toLowerCase()}sChambers`; // TODO: is there a helper for this?
  const TableName = `efcms-${process.env.ENV}-${version}`;

  try {
    await deleteSectionMapping({
      TableName,
      dynamo,
      section,
      userId: bulkImportedUserId,
    });
  } catch (err) {
    console.error(
      `ERROR deleting duplicate chambers section mapping for Judge ${judge}:`,
      err,
    );
    return;
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
 * Deletes a user's section mapping
 *
 * @param {string} section   section name
 * @param {object} dynamo    DynamoDB object
 * @param {string} userId    user id
 * @param {string} TableName dynamo table name
 * @returns {Promise<void>}
 */
const deleteSectionMapping = async ({ dynamo, section, TableName, userId }) => {
  const Key = {
    pk: `section|${section}`,
    sk: `user|${userId}`,
  };
  await dynamo
    .deleteItem({
      Key,
      TableName,
    })
    .promise();
};

/**
 * Retrieves all judge users and formats them in an object structure that reveals duplicates
 *
 * @param {object} applicationContext the application context
 * @returns {object} object containing all users for each judge
 */
const getJudgeUsers = async ({ applicationContext }) => {
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
      judgeUsers[judge.name] = {};
    }
    judgeUsers[judge.name][emailDomain] = judge.userId;
  }
  return judgeUsers;
};

/**
 * Updates the userId of a cognito user created via bulk import
 *
 * @param {string} bulkImportedUserId bulk imported user id
 * @param {object} cognito            Cognito object
 * @param {string} gluedUserId        glued user id
 * @param {string} judge              Judge name
 * @returns {Promise<void>}
 */
const updateImportedCognitoUsersUserIdAttribute = async ({
  bulkImportedUserId,
  cognito,
  gluedUserId,
  judge,
}) => {
  const params = {
    UserAttributes: [
      {
        Name: 'custom:userId',
        Value: gluedUserId,
      },
    ],
    UserPoolId: process.env.COGNITO_USER_POOL,
    Username: bulkImportedUserId,
  };

  try {
    await cognito.adminUpdateUserAttributes(params);
    console.log(`Enabled login for Judge ${judge}`);
  } catch (err) {
    console.error(`ERROR updating custom:userId for Judge ${judge}:`, err);
  }
};

(async () => {
  const applicationContext = createApplicationContext({});
  const version = await getVersion();
  const dynamo = new DynamoDB({ region: process.env.REGION });
  const cognito = new CognitoIdentityServiceProvider({
    region: 'us-east-1', // intentionally hard-coded; cognito user pools are only in us-east-1
  });

  const judgeUsers = await getJudgeUsers({ applicationContext });
  for (const judge in judgeUsers) {
    if (
      'example.com' in judgeUsers[judge] &&
      'ef-cms.ustaxcourt.gov' in judgeUsers[judge]
    ) {
      // this judge was brought over via glue job and was ALSO bulk imported
      const bulkImportedUserId = judgeUsers[judge]['example.com'];
      const gluedUserId = judgeUsers[judge]['ef-cms.ustaxcourt.gov'];

      // delete the bulk imported judge user and chambers section mapping (removes duplicates from judge drop-downs)
      await deleteDuplicateImportedJudgeUser({
        bulkImportedUserId,
        dynamo,
        judge,
        version,
      });

      // change the @example.com cognito user's custom:userId attribute to the glued user's id
      //    this enables login using the judge.name@example.com cognito user created by the bulk import
      await updateImportedCognitoUsersUserIdAttribute({
        bulkImportedUserId,
        cognito,
        gluedUserId,
        judge,
      });
    } else if ('ef-cms.ustaxcourt.gov' in judgeUsers[judge]) {
      // this judge was brought over via glue job but not bulk imported
      // TODO: create cognito user with email `judge.${judge.toLowerCase()}@example.com` and custom:userId gluedUserId
    }
  }
})();
