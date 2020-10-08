const axios = require('axios');
const migratedCase = require('./migratedCase');
const { CognitoIdentityServiceProvider } = require('aws-sdk');

const cognito = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const ClientId = '5imm0ecu6ndbp8bl20b1nojanm';
const UserPoolId = 'us-east-1_1QQo1Dzuy';
const email = 'migrator@example.com';

const color = process.env.DEPLOYING_COLOR || 'blue';
const domain = process.env.EFCMS_DOMAIN || 'exp2.ustc-case-mgmt.flexion.us';

const migrationEndpoint = `https://api-${color}.${domain}/migrate/case`;

let docketNumberCounter = 101;

const getMigratedCase = () => {
  const docketNumber = `${docketNumberCounter++}-77`;
  const docketNumberSuffix = 'L';
  const docketNumberWithSuffix = `${docketNumber}L`;
  return {
    ...migratedCase,
    docketNumber,
    docketNumberSuffix,
    docketNumberWithSuffix,
  };
};

const MIGRATE_CASE_COUNT = 50;
const MIGRATE_LABEL = `Migrating ${MIGRATE_CASE_COUNT} cases`;

(async () => {
  console.time(MIGRATE_LABEL);

  const response = await cognito
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: '', // use env var...
        USERNAME: email,
      },
      ClientId,
      UserPoolId,
    })
    .promise();
  const idToken = response.AuthenticationResult.IdToken;

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  const posts = [];
  for (let i = 0; i < MIGRATE_CASE_COUNT; i++) {
    try {
      posts.push(axiosInstance.post(migrationEndpoint, getMigratedCase()));
    } catch (e) {
      console.log(e);
    }
  }
  await Promise.all(posts);
  console.timeEnd(MIGRATE_LABEL);
})();
