const axios = require('axios');
const axiosRetry = require('axios-retry');
const migratedCase = require('./migratedCase');
const { chunk, range } = require('lodash');
const { CognitoIdentityServiceProvider } = require('aws-sdk');

/*
What are the OTHER bottlenecks?
 * tax court network

Estimates:
 - Migrating 1000 cases: 79875.731ms ~~ 20K in 26min (chunk: 50)
 - Migrating 1000 cases: 89851.463ms ~~ 20K in 30min (chunk 25)
 - Migrating 1000 cases: 101678.208ms (2 failed!) ~~ 20K in 33min (chunk 100)
*/

const cognito = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const ClientId = '3bo55ojh0hk00fiadpg5o9mckf';
const UserPoolId = 'us-east-1_nqc5Vw7zE';
const USERNAME = 'migrator@example.com';
const PASSWORD = process.env.DEFAULT_ACCOUNT_PASS;
const CHUNK_SIZE = 50;

const color = process.env.DEPLOYING_COLOR || 'blue';
const domain = process.env.EFCMS_DOMAIN || 'exp3.ustc-case-mgmt.flexion.us';

const migrationEndpoint = `https://api-${color}.${domain}/migrate/case`;

let MIGRATE_CASE_COUNT,
  MIGRATE_CASE_YEAR = '82';

let docketNumberCounter = 101;

const getMigratedCase = () => {
  const docketNumber = `${docketNumberCounter++}-${MIGRATE_CASE_YEAR}`;
  const docketNumberSuffix = 'L';
  const docketNumberWithSuffix = `${docketNumber}L`;

  const docketEntries = migratedCase.docketEntries.map(entry => ({
    ...entry,
    docketNumber,
  }));

  const ret = {
    ...migratedCase,
    docketEntries,
    docketNumber,
    docketNumberSuffix,
    docketNumberWithSuffix,
  };

  if (process.env.DEBUG) {
    console.log(JSON.stringify(ret, null, 2));
  }

  return ret;
};

try {
  MIGRATE_CASE_COUNT = parseInt(process.argv[2]);
  if (process.argv[3]) {
    MIGRATE_CASE_YEAR = parseInt(process.argv[3]);
  }
  if (isNaN(MIGRATE_CASE_COUNT) || isNaN(MIGRATE_CASE_YEAR)) {
    throw new Error('must provide a number');
  }
} catch (e) {
  console.log('Usage: > node migrationPerfTest.js <quantity> (<year>)');
  process.exit(0);
}

const MIGRATE_LABEL = `Migrating ${MIGRATE_CASE_COUNT} cases`;

(async () => {
  console.time(MIGRATE_LABEL);

  const response = await cognito
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD,
        USERNAME,
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

  axiosRetry(axiosInstance, {
    retries: 10,
    retryCondition: error => {
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.response === undefined
      );
    },
    retryDelay: axiosRetry.exponentialDelay,
    shouldResetTimeout: true,
  });

  let migratedCasesCompleted = 0;
  const migrationsToProcess = range(0, MIGRATE_CASE_COUNT); // [0,1,2,3,4,5]
  const chunkedJobs = chunk(migrationsToProcess, CHUNK_SIZE); // e.g. [[0,1,2], [3,4,5]]
  for (let chunkJob of chunkedJobs) {
    const chunkPromises = chunkJob.map(() =>
      axiosInstance.post(migrationEndpoint, getMigratedCase()),
    );
    const results = await Promise.allSettled(chunkPromises);
    results.forEach((p, i) => {
      const isRejected = p.status == 'rejected';
      if (isRejected) {
        console.log('>>> Index failed at', i);
        console.log(p.reason);
      }
    });
    migratedCasesCompleted += chunkJob.length;
    console.log('Migrated', migratedCasesCompleted);
  }

  console.timeEnd(MIGRATE_LABEL);
})();
