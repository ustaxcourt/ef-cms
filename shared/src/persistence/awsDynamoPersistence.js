const client = require('./dynamodbClientService');

const stripInternalKeys = items => {
  const strip = item => {
    delete item.sk;
    delete item.pk;
  };
  if (!items) {
    return null;
  } else if (items.length) {
    items.forEach(strip);
  } else {
    strip(items);
  }
  return items;
};
exports.stripInternalKeys = stripInternalKeys;

const getRecordsViaMapping = async ({ applicationContext, key, type }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  const mapping = await client.query({
    TableName: TABLE,
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${key}|${type}`,
    },
    KeyConditionExpression: '#pk = :pk',
  });

  const ids = mapping.map(metadata => metadata.sk);

  const results = await client.batchGet({
    tableName: TABLE,
    keys: ids.map(id => ({
      pk: id,
      sk: id,
    })),
  });

  return stripInternalKeys(results);
};

exports.getRecordsViaMapping = getRecordsViaMapping;

const getRecordViaMapping = async ({ applicationContext, key, type }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  const [mapping] = await client.query({
    TableName: TABLE,
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${key}|${type}`,
    },
    KeyConditionExpression: '#pk = :pk',
  });

  if (!mapping) return null;

  const sk = mapping.sk;

  const results = await client.get({
    TableName: TABLE,
    Key: {
      pk: sk,
      sk: sk,
    },
  });

  return stripInternalKeys(results);
};

exports.getRecordViaMapping = getRecordViaMapping;

/**
 * incrementCounter
 * @param applicationContext
 * @returns {*}
 */
// TODO: Hard coded to update the docketNumberCounter, but should
// be refactored to update any type of atomic counter in dynamo
// if we can pass in table / key
exports.incrementCounter = ({ applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  return client.updateConsistent({
    TableName: TABLE,
    Key: {
      pk: 'docketNumberCounter',
      sk: 'docketNumberCounter', // TODO: set sk by the year, i.e. 2018
    },
    UpdateExpression: 'ADD #a :x',
    ExpressionAttributeNames: {
      '#a': 'id',
    },
    ExpressionAttributeValues: {
      ':x': 1,
    },
    ReturnValues: 'UPDATED_NEW',
  });
};

const createRespondentCaseMapping = async ({
  caseId,
  respondentId,
  applicationContext,
}) => {
  return client.put({
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: `${respondentId}|activeCase`,
      sk: caseId,
    },
  });
};

exports.createRespondentCaseMapping = createRespondentCaseMapping;

exports.deleteMappingRecord = async ({
  pkId,
  skId,
  type,
  applicationContext,
}) => {
  await client.delete({
    tableName: `efcms-${applicationContext.environment.stage}`,
    key: {
      pk: `${pkId}|${type}`,
      sk: skId,
    },
  });
};

exports.createMappingRecord = async ({
  pkId,
  skId,
  type,
  applicationContext,
}) => {
  return client.put({
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: `${pkId}|${type}`,
      sk: skId,
    },
  });
};

const stripWorkItems = (casesToModify, shouldDeleteWorkItems) => {
  if (!shouldDeleteWorkItems) return casesToModify;
  const strip = caseToModify => {
    delete caseToModify.workItems;
  };

  if (casesToModify.length) {
    return casesToModify.map(strip);
  } else {
    return strip(casesToModify);
  }
};
exports.stripWorkItems = stripWorkItems;
