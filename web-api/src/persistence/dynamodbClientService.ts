import { TDynamoRecord } from './dynamo/dynamoTypes';
import { chunk, isEmpty } from 'lodash';

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

export const getTableName = ({ applicationContext }): string =>
  (applicationContext.environment &&
    applicationContext.environment.dynamoDbTableName) ||
  (applicationContext.getEnvironment() &&
    applicationContext.getEnvironment().dynamoDbTableName);

export const getDeployTableName = ({ applicationContext }) => {
  const env =
    applicationContext.environment || applicationContext.getEnvironment();

  if (env.stage === 'local') {
    return env.dynamoDbTableName;
  }

  return `efcms-deploy-${env.stage}`;
};

export const describeTable = async ({ applicationContext }) => {
  const dynamoClient = applicationContext.getDynamoClient();

  const params = {
    TableName: getTableName({ applicationContext }),
  };

  return await dynamoClient.describeTable(params).promise();
};

export const describeDeployTable = async ({ applicationContext }) => {
  const dynamoClient = applicationContext.getDynamoClient({
    useMasterRegion: true,
  });

  const params = {
    TableName: getDeployTableName({ applicationContext }),
  };

  return await dynamoClient.describeTable(params).promise();
};

/**
 *
 * @param {object} params the params to put
 * @returns {object} the item that was put
 */
export const put = ({
  applicationContext,
  Item,
}: {
  Item: TDynamoRecord;
  applicationContext: IApplicationContext;
}): Promise<TDynamoRecord> => {
  return applicationContext
    .getDocumentClient()
    .put({
      Item: filterEmptyStrings(Item),
      TableName: getTableName({
        applicationContext,
      }),
    })
    .promise()
    .then(() => Item);
};

/**
 *
 * @param {object} params the params to update
 * @returns {object} the item that was updated
 */
export const update = ({
  applicationContext,
  ConditionExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues,
  Key,
  UpdateExpression,
}: {
  ConditionExpression?: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, string | boolean>;
  Key: Record<string, string>;
  UpdateExpression: string;
  applicationContext: IApplicationContext;
}): Promise<TDynamoRecord[]> => {
  const filteredValues = filterEmptyStrings(ExpressionAttributeValues);
  return applicationContext
    .getDocumentClient()
    .update({
      ConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues: filteredValues,
      Key,
      TableName: getTableName({
        applicationContext,
      }),
      UpdateExpression,
    })
    .promise()
    .then(() => undefined);
};

/**
 *
 * @param {object} params the params to update
 * @returns {object} the item that was updated
 */
export const updateToDeployTable = params => {
  const filteredParams = filterEmptyStrings(params);
  return params.applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .update({
      TableName: getDeployTableName({
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
export const updateConsistent = params => {
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
    .then(data => data.Attributes);
};

/**
 * get
 *
 * @param {object} params the params to get
 * @returns {object} the item that was retrieved
 */
export const get = params => {
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
    });
};

/**
 * get
 *
 * @param {object} params the params to get
 * @returns {object} the item that was retrieved
 */
export const getFromDeployTable = params => {
  return params.applicationContext
    .getDocumentClient({
      useMasterRegion: true,
    })
    .get({
      TableName: getDeployTableName({
        applicationContext: params.applicationContext,
      }),
      ...params,
    })
    .promise()
    .then(res => {
      return removeAWSGlobalFields(res.Item);
    });
};

/**
 * GET for aws-sdk dynamodb client
 *
 * @param {object} params the params to update
 * @returns {object} the item that was updated
 */
export const query = ({
  applicationContext,
  ConsistentRead = false,
  ExpressionAttributeNames,
  ExpressionAttributeValues,
  FilterExpression,
  IndexName,
  KeyConditionExpression,
  Limit,
  ...params
}: {
  ConsistentRead?: boolean;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, string | number>;
  IndexName?: string;
  Limit?: number;
  FilterExpression?: string;
  KeyConditionExpression: string;
  applicationContext: IApplicationContext;
  params?: Record<string, any>;
}): Promise<TDynamoRecord[]> => {
  return applicationContext
    .getDocumentClient()
    .query({
      ConsistentRead,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      FilterExpression,
      IndexName,
      KeyConditionExpression,
      Limit,
      TableName: getTableName({
        applicationContext,
      }),
      ...params,
    })
    .promise()
    .then(result => {
      result.Items.forEach(removeAWSGlobalFields);
      return result.Items;
    });
};

export const scan = async params => {
  let hasMoreResults = true;
  let lastKey = null;
  const allItems = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    await params.applicationContext
      .getDocumentClient()
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: getTableName({
          applicationContext: params.applicationContext,
        }),
        ...params,
      })
      .promise()
      .then(results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        allItems.push(...results.Items);
      });
  }
  return allItems;
};

/**
 * GET for aws-sdk dynamodb client
 *
 * @param {object} params the params to update
 * @returns {object} the item that was updated
 */
export const queryFull = async ({
  applicationContext,
  ConsistentRead = false,
  ExpressionAttributeNames,
  ExpressionAttributeValues,
  FilterExpression,
  IndexName,
  KeyConditionExpression,
  ...params
}: {
  ConsistentRead?: boolean;
  applicationContext: IApplicationContext;
  params?: Record<string, any>;
  IndexName?: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, string>;
  FilterExpression?: string;
  KeyConditionExpression: string;
}): Promise<TDynamoRecord[]> => {
  let hasMoreResults = true;
  let lastKey = null;
  let allResults = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    const subsetResults = await applicationContext
      .getDocumentClient()
      .query({
        ConsistentRead,
        ExclusiveStartKey: lastKey,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        FilterExpression,
        IndexName,
        KeyConditionExpression,
        TableName: getTableName({
          applicationContext,
        }),
        ...params,
      })
      .promise();

    hasMoreResults = !!subsetResults.LastEvaluatedKey;
    lastKey = subsetResults.LastEvaluatedKey;

    subsetResults.Items.forEach(removeAWSGlobalFields);

    allResults = [...allResults, ...subsetResults.Items];
  }

  return allResults;
};

/**
 * BATCH GET for aws-sdk dynamodb client
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.keys the keys to get
 * @returns {Array} the results retrieved
 */
export const batchGet = async ({ applicationContext, keys }) => {
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
 * @returns {Promise|void} the promise of the persistence call
 */
export const batchDelete = ({ applicationContext, items }) => {
  if (!items || items.length === 0) {
    return Promise.resolve();
  }

  const batchDeleteItems = itemsToDelete => {
    return applicationContext
      .getDocumentClient()
      .batchWrite({
        RequestItems: {
          [getTableName({ applicationContext })]: itemsToDelete.map(item => ({
            DeleteRequest: {
              Key: {
                pk: item.pk,
                sk: item.sk,
              },
            },
          })),
        },
      })
      .promise();
  };

  const results = batchDeleteItems(items);

  if (!isEmpty(results.UnprocessedItems)) {
    const retryResults = batchDeleteItems(results.UnprocessedItems);

    if (!isEmpty(retryResults.UnprocessedItems)) {
      applicationContext.logger.error(
        'Unable to batch delete',
        retryResults.UnprocessedItems,
      );
    }
  }
};

export const remove = ({
  applicationContext,
  key,
}: {
  applicationContext: IApplicationContext;
  key: Record<string, string>;
}) => {
  return applicationContext
    .getDocumentClient()
    .delete({
      Key: key,
      TableName: getTableName({ applicationContext }),
    })
    .promise();
};
