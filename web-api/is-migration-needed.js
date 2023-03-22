const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const { ENV } = process.env;

if (!ENV) {
  throw new Error('Please provide an environment.');
}

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

const getFilesInDirectory = dir => {
  const files = fs.readdirSync(dir);
  return files.filter(
    file =>
      !file.endsWith('.test.js') &&
      !file.endsWith('.test.ts') &&
      !file.startsWith('0000'),
  );
};

const hasMigrationRan = async key => {
  const { Item } = await docClient
    .get({
      Key: {
        pk: `migration|${key}`,
        sk: `migration|${key}`,
      },
      TableName: `efcms-deploy-${ENV}`,
    })
    .promise();
  return !!Item;
};

(async () => {
  const migrationFiles = getFilesInDirectory(
    path.join(
      __dirname,
      './workflow-terraform/migration/main/lambdas/migrations',
    ),
  );
  for (let migrationFile of migrationFiles) {
    const hasRan = await hasMigrationRan(migrationFile);
    if (!hasRan) {
      console.log(
        `${migrationFile} has not ran, migration is needed, exiting with status code 0`,
      );
      process.exit(0);
    }
  }
  console.log('migration is NOT needed, exiting with status code 1');
  process.exit(1);
})();
