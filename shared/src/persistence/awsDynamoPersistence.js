const client = require('./dynamodbClientService');

const { stripInternalKeys } = require('./dynamo/helpers/stripInternalKeys');

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
