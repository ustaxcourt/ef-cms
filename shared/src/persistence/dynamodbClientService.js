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

/**
 *
 * @param params
 * @returns {*}
 */
exports.put = params => {
  return params.applicationContext
    .getDocumentClient()
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
  return params.applicationContext
    .getDocumentClient({
      region: params.applicationContext.environment.masterRegion,
    })
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
  return params.applicationContext
    .getDocumentClient()
    .get(params)
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
exports.batchGet = ({ applicationContext, tableName, keys }) => {
  if (!keys.length) return [];
  // TODO: BATCH GET CAN ONLY DO 25 AT A TIME
  return applicationContext
    .getDocumentClient()
    .batchGet({
      RequestItems: {
        [tableName]: {
          Keys: keys,
        },
      },
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
 *
 * @param applicationContext
 * @param tableName
 * @param items
 * @returns {*}
 */
exports.batchWrite = ({ applicationContext, tableName, items }) => {
  return applicationContext
    .getDocumentClient()
    .batchWrite({
      RequestItems: {
        [tableName]: items.map(item => ({
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

exports.delete = ({ applicationContext, tableName, key }) => {
  return applicationContext
    .getDocumentClient()
    .delete({
      Key: key,
      TableName: tableName,
    })
    .promise();
};
