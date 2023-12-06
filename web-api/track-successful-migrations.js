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

const trackMigration = async key => {
  console.log(`marking migration ${key} as ran`);
  return docClient
    .put({
      Item: {
        createdAt: new Date().toISOString(),
        pk: `migration|${key}`,
        sk: `migration|${key}`,
      },
      TableName: `efcms-deploy-${ENV}`,
    })
    .promise();
};

(async () => {
  const migrationFiles = getFilesInDirectory(
    path.join(
      __dirname,
      './workflow-terraform/migration/main/lambdas/migrations',
    ),
  );
  for (let migrationFile of migrationFiles) {
    await trackMigration(migrationFile);
  }
})();
