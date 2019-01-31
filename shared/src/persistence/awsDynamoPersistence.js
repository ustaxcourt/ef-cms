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

const getSortRecordsViaMapping = async ({
  applicationContext,
  key,
  type,
  foreignKey,
  afterDate,
  isVersioned = false,
}) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  const mapping = await client.query({
    applicationContext,
    TableName: TABLE,
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `${key}|${type}`,
      ':afterDate': afterDate,
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
  });

  const ids = mapping.map(metadata => metadata[foreignKey]);

  const results = await client.batchGet({
    applicationContext,
    tableName: TABLE,
    keys: ids.map(id => ({
      pk: id,
      sk: isVersioned ? '0' : id,
    })),
  });

  return stripInternalKeys(results);
};

exports.getSortRecordsViaMapping = getSortRecordsViaMapping;

const getRecordsViaMapping = async ({
  applicationContext,
  key,
  type,
  isVersioned = false,
}) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  const mapping = await client.query({
    applicationContext,
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
    applicationContext,
    tableName: TABLE,
    keys: ids.map(id => ({
      pk: id,
      sk: isVersioned ? '0' : id,
    })),
  });

  return stripInternalKeys(results);
};

exports.getRecordsViaMapping = getRecordsViaMapping;

const getRecordViaMapping = async ({
  applicationContext,
  key,
  type,
  isVersioned = false,
}) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  const [mapping] = await client.query({
    applicationContext,
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
    applicationContext,
    TableName: TABLE,
    Key: {
      pk: sk,
      sk: isVersioned ? '0' : sk,
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

  const year = new Date().getFullYear().toString();

  return client.updateConsistent({
    applicationContext,
    TableName: TABLE,
    Key: {
      pk: `docketNumberCounter-${year}`,
      sk: `docketNumberCounter-${year}`,
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
  applicationContext,
  caseId,
  respondentId,
}) => {
  return client.put({
    applicationContext,
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: `${respondentId}|activeCase`,
      sk: caseId,
    },
  });
};

exports.createRespondentCaseMapping = createRespondentCaseMapping;

exports.deleteMappingRecord = async ({
  applicationContext,
  pkId,
  skId,
  type,
}) => {
  await client.delete({
    applicationContext,
    tableName: `efcms-${applicationContext.environment.stage}`,
    key: {
      pk: `${pkId}|${type}`,
      sk: skId,
    },
  });
};

exports.createMappingRecord = async ({
  applicationContext,
  pkId,
  skId,
  type,
}) => {
  return client.put({
    applicationContext,
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: `${pkId}|${type}`,
      sk: skId,
    },
  });
};

exports.createSortMappingRecord = async ({
  applicationContext,
  pkId,
  skId,
  item,
  type,
}) => {
  return client.put({
    applicationContext,
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: `${pkId}|${type}`,
      sk: skId,
      ...item,
    },
  });
};

const stripWorkItems = (casesToModify, isAuthorizedForWorkItems) => {
  if (isAuthorizedForWorkItems) return casesToModify;
  if (!casesToModify) return casesToModify;

  const strip = caseToModify => {
    delete caseToModify.workItems;
  };

  if (casesToModify.length) {
    casesToModify.forEach(strip);
    return casesToModify;
  } else {
    strip(casesToModify);
    return casesToModify;
  }
};

exports.stripWorkItems = stripWorkItems;
