const AWS = require('aws-sdk');

const region = process.env.AWS_REGION ? process.env.AWS_REGION : 'us-east-1';
AWS.config.update({region: region});
// AWS.config.update({retryDelayOptions: {base: 300}});



exports.put = params => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  return documentClient.put(params)
    .promise()
    .then(() => params.Item);

};