const AWS = require('aws-sdk');
const region = process.env.AWS_REGION || 'us-east-1';

/**
 * PUT for dynamodb aws-sdk client
 * @param item
 * @returns {*}
 */

const removeAWSGlobalFields = item => {
  // dynamodb always adds these fields for purposes of global tables
  delete item['aws:rep:deleting'];
  delete item['aws:rep:updateregion'];
  delete item['aws:rep:updatetime'];
  return item;
};
/**
 * put
 * @param params
 * @returns {*}
 */
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
/**
 * updateConsistent
 * @param params
 * @returns {*}
 */
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
/**
 * get
 * @param params
 * @returns {*}
 */
exports.get = params => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: region,
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  });

  return documentClient
    .get(params)
    .promise()
    .then(res => {
      if (!res.Item) throw new Error(`get failed on ${JSON.stringify(params)}`);
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

/**
 * BATCH GET for aws-sdk dynamodb client
 * @param params
 */
exports.batchGet = ({ tableName, keys }) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: region,
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  });

  // TODO: BATCH GET CAN ONLY DO 25 AT A TIME
  return documentClient
    .batchGet({
      RequestItems: {
        [tableName]: {
          Keys: keys
        }
      }
    })
    .promise()
    .then(result => {
      // TODO: REFACTOR THIS
      const items = result.Responses[tableName];
      items.forEach(item => removeAWSGlobalFields(item));
      return items;
    });
};


/**
 * batchWrite
 */
 exports.batchWrite = ({ tableName, items }) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: region,
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  });

  return documentClient
    .batchWrite({
      RequestItems: {
        [tableName]: items.map(item => ({
          PutRequest: {
            Item: item,
            ConditionExpression: `attribute_not_exists(#pk) and attribute_not_exists(#sk)`,
            ExpressionAttributeNames: {
              "#pk" : item.pk,
              "#sk" : item.sk
            }            
          }
        }))
      }
    })
    .promise();
 }