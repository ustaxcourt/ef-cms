import { type BatchGetResponseMap } from 'aws-sdk/clients/dynamodb';
import { DeleteRequest, PutRequest, TDynamoRecord } from './dynamo/dynamoTypes';
import {
  DescribeTableCommand,
  DescribeTableCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { chunk, flatten, isEmpty, uniqBy } from 'lodash';
import { filterEmptyStrings } from '../../../shared/src/business/utilities/filterEmptyStrings';

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

export const describeTable = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<DescribeTableCommandOutput> => {
  const dynamoClient = applicationContext.getDynamoClient(applicationContext, {
    useMainRegion: false,
  });

  const describeTableCommand: DescribeTableCommand = new DescribeTableCommand({
    TableName: getTableName({ applicationContext }),
  });

  return await dynamoClient.send(describeTableCommand);
};

export const describeDeployTable = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<DescribeTableCommandOutput> => {
  const dynamoClient = applicationContext.getDynamoClient(applicationContext, {
    useMainRegion: true,
  });

  const describeTableCommand: DescribeTableCommand = new DescribeTableCommand({
    TableName: getDeployTableName({ applicationContext }),
  });

  return await dynamoClient.send(describeTableCommand);
};

export const put = ({
  applicationContext,
  Item,
}: {
  Item: TDynamoRecord;
  applicationContext: IApplicationContext;
}): Promise<TDynamoRecord> => {
  return applicationContext
    .getDocumentClient(applicationContext)
    .put({
      Item: filterEmptyStrings(Item),
      TableName: getTableName({
        applicationContext,
      }),
    })
    .then(() => Item);
};

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
    .getDocumentClient(applicationContext)
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
    .getDocumentClient(params.applicationContext, {
      useMainRegion: true,
    })
    .update({
      TableName: getDeployTableName({
        applicationContext: params.applicationContext,
      }),
      ...filteredParams,
    })
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
    .getDocumentClient(params.applicationContext, {
      useMainRegion: true,
    })
    .update({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...filteredParams,
    })
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
    .getDocumentClient(params.applicationContext, {
      useMainRegion: !!params.ConsistentRead,
    })
    .get({
      TableName: getTableName({
        applicationContext: params.applicationContext,
      }),
      ...params,
    })
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
    .getDocumentClient(params.applicationContext, {
      useMainRegion: true,
    })
    .get({
      TableName: getDeployTableName({
        applicationContext: params.applicationContext,
      }),
      ...params,
    })
    .then(res => {
      return removeAWSGlobalFields(res.Item);
    });
};

export const putInDeployTable = async (
  applicationContext: IApplicationContext,
  item: TDynamoRecord,
): Promise<void> => {
  await applicationContext
    .getDocumentClient(applicationContext, {
      useMainRegion: true,
    })
    .put({
      Item: item,
      TableName: getDeployTableName({
        applicationContext,
      }),
    });
};

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
    .getDocumentClient(applicationContext)
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
    .then(result => {
      result.Items.forEach(removeAWSGlobalFields);
      return result.Items;
    });
};

export const scan = async params => {
  let hasMoreResults = true;
  let lastKey;
  const allItems: any[] = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    await params.applicationContext
      .getDocumentClient(params.applicationContext)
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: getTableName({
          applicationContext: params.applicationContext,
        }),
        ...params,
      })
      .then(results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        allItems.push(...results.Items);
      });
  }
  return allItems;
};

export const queryFull = async <T>({
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
}): Promise<TDynamoRecord<T>[]> => {
  let hasMoreResults = true;
  let lastKey;
  let allResults: TDynamoRecord<T>[] = [];

  while (hasMoreResults) {
    hasMoreResults = false;

    const subsetResults = await applicationContext
      .getDocumentClient(applicationContext)
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
      });

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
export const batchGet = async ({
  applicationContext,
  keys,
}: {
  applicationContext: IApplicationContext;
  keys: Pick<TDynamoRecord, 'pk' | 'sk'>[];
}): Promise<TDynamoRecord[]> => {
  if (!keys.length) return [];
  const tableName = getTableName({ applicationContext });
  const uniqueKeys = uniqBy(keys, key => {
    return key.pk + key.sk;
  });
  const chunks = chunk(uniqueKeys, 100);

  const promises: Promise<BatchGetResponseMap>[] = chunks.map(chunkOfKeys =>
    applicationContext.getDocumentClient(applicationContext).batchGet({
      RequestItems: {
        [tableName]: {
          Keys: chunkOfKeys,
        },
      },
    }),
  );

  const results = (await Promise.all(promises)).map(result =>
    result.Responses[tableName].map(removeAWSGlobalFields),
  );
  return flatten(results);
};

type DynamoRecordKey = {
  pk: string;
  sk: string;
};

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.items the items to write
 * @returns {Promise|void} the promise of the persistence call
 */
export const batchDelete = async ({
  applicationContext,
  items,
}: {
  applicationContext: ServerApplicationContext;
  items: DynamoRecordKey[] | undefined;
}): Promise<void> => {
  if (!items || items.length === 0) {
    return Promise.resolve();
  }

  const batchDeleteItems = itemsToDelete => {
    return applicationContext.getDocumentClient(applicationContext).batchWrite({
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
    });
  };

  const results = await batchDeleteItems(items);

  if (!isEmpty(results.UnprocessedItems)) {
    const retryResults = await batchDeleteItems(results.UnprocessedItems);

    if (!isEmpty(retryResults.UnprocessedItems)) {
      applicationContext.logger.error(
        'Unable to batch delete',
        retryResults.UnprocessedItems,
      );
    }
  }
};

export const batchWrite = async (
  commands: (DeleteRequest | PutRequest)[],
  applicationContext: IApplicationContext,
): Promise<void> => {
  commands.forEach(command => filterEmptyStrings(command));
  const documentClient =
    applicationContext.getDocumentClient(applicationContext);
  const chunks = chunk(commands, 25);

  await Promise.all(
    chunks.map(commandChunk =>
      documentClient.batchWrite({
        RequestItems: {
          [applicationContext.environment.dynamoDbTableName]: commandChunk,
        },
      }),
    ),
  );

  return;
};

export const remove = ({
  applicationContext,
  key,
}: {
  applicationContext: IApplicationContext;
  key: Record<string, string>;
}) => {
  return applicationContext.getDocumentClient(applicationContext).delete({
    Key: key,
    TableName: getTableName({ applicationContext }),
  });
};
