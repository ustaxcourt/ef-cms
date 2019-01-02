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
 * put
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
  // TODO: refactor: this method is not generic enough; it expects all updates to return back an object with a 'id' property..
  return params.applicationContext
    .getDocumentClient()
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
    .catch(err => {
      console.error(err);
      return null;
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
 * batchWrite
 */
exports.batchWrite = ({ applicationContext, tableName, items }) => {
  return applicationContext
    .getDocumentClient()
    .batchWrite({
      RequestItems: {
        [tableName]: items.map(item => ({
          PutRequest: {
            Item: item,
            ConditionExpression: `attribute_not_exists(#pk) and attribute_not_exists(#sk)`,
            ExpressionAttributeNames: {
              '#pk': item.pk,
              '#sk': item.sk,
            },
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
      TableName: tableName,
      Key: key,
    })
    .promise();
};
