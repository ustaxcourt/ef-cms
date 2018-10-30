const AWS = require('aws-sdk');
const region = process.env.AWS_REGION || 'us-east-1';

exports.put = params => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: region,
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  });

  return documentClient
    .put(params)
    .promise()
    .then(() => params.Item);
};
