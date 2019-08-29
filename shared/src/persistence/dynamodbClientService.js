const { chunk } = require('lodash');

/**
 * PUT for dynamodb aws-sdk client
 *
 * @param {object} item the item to remove AWS global fields from
 * @returns {object} the item with AWS global fields removed
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
 * used to filter empty strings from values before storing in dynamo
 *
 * @param {object} params the params to filter empty strings from
 * @returns {object} the params with empty string values removed
 */
const filterEmptyStrings = params => {
  const removeEmpty = obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        removeEmpty(obj[key]);
      } else if (obj[key] === '') {
        delete obj[key];
      }
    });
  };

  if (params) {
    removeEmpty(params);
  }
  return params;
};

const getTableName = ({ applicationContext }) =>
  `efcms-${applicationContext.environment.stage}`;
/**
 *
 * @param {object} params the params to put
 * @returns {object} the item that was put
 */
exports.put = params => {
  const filteredParams = filterEmptyStrings(params);
  return params.applicationContext
    .getDocumentClient()
    .put({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...filteredParams,
    })
    .promise()
    .then(() => params.Item);
};

/**
 *
 * @param {object} params the params to update
 * @returns {object} the item that was updated
 */
exports.update = params => {
  const filteredParams = filterEmptyStrings(params);
  return params.applicationContext
    .getDocumentClient()
    .update({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...filteredParams,
    })
    .promise()
    .then(() => params.Item);
};

/**
 * updateConsistent
 *
 * @param {object} params the params to update
 * @returns {object} the item that was updated
 */
exports.updateConsistent = params => {
  const filteredParams = filterEmptyStrings(params);
  return params.applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .update({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...filteredParams,
    })
    .promise()
    .then(data => data.Attributes.id);
};

/**
 * get
 *
 * @param {object} params the params to get
 * @returns {object} the item that was retrieved
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
 *
 * @param {object} params the params to update
 * @returns {object} the item that was updated
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
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.keys the keys to get
 * @returns {Array} the results retrieved
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
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.items the items to write
 * @returns {Promise} the promise of the persistence call
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
            Item: filterEmptyStrings(item),
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
