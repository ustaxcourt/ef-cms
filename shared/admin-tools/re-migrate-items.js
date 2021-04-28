const docketNumbers = ['4979-21', '4977-21'];

const AWS = require('aws-sdk');
const { DynamoDB } = require('aws-sdk');
const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const dynamodb = new DynamoDB({ region: 'us-east-1' });
const {
  migrateItems,
} = require('../../../web-api/migration-terraform/main/lambdas/migrations/0025-add-contacts-to-petitioners-array.js');
const lookupCase = async docketNumber => {
  const tableName = `efcms-${environmentName}-${version}`;
  const result = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: `case|${docketNumber}`,
        },
        sk: {
          S: `case|${docketNumber}`,
        },
      },
      TableName: tableName,
    })
    .promise();
  const item = DynamoDB.Converter.unmarshall(result.Item);
  // check to see if they are in the old format?
  // console.log(item);
  const [newItem] = await migrateItems([item]);
  // we should putItem newItem into Dynamo
  await dynamodb
    .putItem({
      Item: AWS.DynamoDB.Converter.marshall(newItem),
      TableName: tableName,
    })
    .promise();
  console.log(newItem.petitioners);
};
(async () => {
  for (const docketNumber of docketNumbers) {
    await lookupCase(docketNumber);
  }
})();
