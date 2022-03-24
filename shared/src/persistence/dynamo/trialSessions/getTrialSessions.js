const { queryFull } = require('../../dynamodbClientService');

exports.getTrialSessions = ({ applicationContext }) =>
  queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': 'trial-session-catalog',
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

const AWS = require('aws-sdk');

console.time('request');
exports
  .getTrialSessions({
    applicationContext: {
      environment: {
        dynamoDbTableName: 'efcms-test-beta',
      },
      getDocumentClient: () => {
        return new AWS.DynamoDB.DocumentClient({
          region: 'us-east-1',
        });
      },
    },
  })
  .then(results => {
    console.timeEnd('request');
    console.log(results.filter(r => r.isCalendared && !r.isClosed).length);
  });
