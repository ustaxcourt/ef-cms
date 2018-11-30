const AWS = require('aws-sdk');
const region = process.env.AWS_REGION || 'us-east-1';

/**
 * PUT for dynamodb aws-sdk client
 *
 * @param params
 */

const removeAWSGlobalFields = item => {
  // dynamodb always adds these fields for purposes of global tables
  delete item['aws:rep:deleting'];
  delete item['aws:rep:updateregion'];
  delete item['aws:rep:updatetime'];
  return item;
};

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

exports.updateConsistent = params => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.MASTER_REGION || 'us-east-1',
    endpoint: process.env.MASTER_DYNAMODB_ENDPOINT || 'http://localhost:8000',
  });
  return documentClient
    .update(params)
    .promise()
    .then(data => data.Attributes.id);
};

exports.get = params => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: region,
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  });

  return documentClient
    .get(params)
    .promise()
    .then(res => {
      return removeAWSGlobalFields(res.Item);
    });
};

/**
 * GET for aws-sdk dynamodb client
 * @param params
 */
exports.query = params => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: region,
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  });

  return documentClient
    .query(params)
    .promise()
    .then(result => {
      result.Items.forEach(item => removeAWSGlobalFields(item));
      return result.Items;
    });
};
