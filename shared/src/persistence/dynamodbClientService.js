const { chunk } = require('lodash');

/**
 * PUT for dynamodb aws-sdk client
 * @param item
 * @returns {*}
 */
const removeAWSGlobalFields = item => {
  // dynamodb always adds these fields for purposes of global tables
  if (item) {
    delete item['aws:rep:deleting'];
    delete item['aws:rep:updateregion'];
    delete item['aws:rep:updatetime'];
  }
  return item;
};

const getTableName = ({ applicationContext }) =>
  `efcms-${applicationContext.environment.stage}`;
/**
 *
 * @param params
 * @returns {*}
 */
exports.put = params => {
  return params.applicationContext
    .getDocumentClient()
    .put({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...params,
    })
    .promise()
    .then(() => params.Item);
};

/**
 * updateConsistent
 * @param params
 * @returns {*}
 */
exports.updateConsistent = params => {
  return params.applicationContext
    .getDocumentClient({
      region: params.applicationContext.environment.masterRegion,
    })
    .update({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...params,
    })
    .promise()
    .then(data => data.Attributes.id);
};

/**
 * get
 * @param params
 * @returns {*}
 */
exports.get = params => {
  return params.applicationContext
    .getDocumentClient()
    .get({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...params,
    })
    .promise()
    .then(res => {
      return removeAWSGlobalFields(res.Item);
    })
    .catch(() => {
      return undefined;
    });
};

/**
 * GET for aws-sdk dynamodb client
 * @param params
 */
exports.query = params => {
  return params.applicationContext
    .getDocumentClient()
    .query({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...params,
    })
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
exports.batchGet = async ({ applicationContext, keys }) => {
  if (!keys.length) return [];
  const chunks = chunk(keys, 100);

  let results = [];
  for (let chunkOfKeys of chunks) {
    results = results.concat(
      await applicationContext
        .getDocumentClient()
        .batchGet({
          RequestItems: {
            [getTableName({ applicationContext })]: {
              Keys: chunkOfKeys,
            },
          },
        })
        .promise()
        .then(result => {
          const items = result.Responses[getTableName({ applicationContext })];
          items.forEach(item => removeAWSGlobalFields(item));
          return items;
        }),
    );
  }
  return results;
};

/**
 *
 * @param applicationContext
 * @param tableName
 * @param items
 * @returns {*}
 */
exports.batchWrite = ({ applicationContext, items }) => {
  return applicationContext
    .getDocumentClient()
    .batchWrite({
      RequestItems: {
        [getTableName({ applicationContext })]: items.map(item => ({
          PutRequest: {
            ConditionExpression:
              'attribute_not_exists(#pk) and attribute_not_exists(#sk)',
            ExpressionAttributeNames: {
              '#pk': item.pk,
              '#sk': item.sk,
            },
            Item: item,
          },
        })),
      },
    })
    .promise();
};

exports.delete = ({ applicationContext, key }) => {
  return applicationContext
    .getDocumentClient()
    .delete({
      Key: key,
      TableName: getTableName({ applicationContext }),
    })
    .promise();
};
