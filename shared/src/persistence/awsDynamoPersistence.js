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

/**
 * createCase
 * @param caseRecord
 * @param applicationContext
 * @returns {*}
 */
exports.createCase = async ({ caseRecord, applicationContext }) => {
  await client.batchWrite({
    tableName: `efcms-${applicationContext.environment.stage}`,
    items: [
      {
        pk: caseRecord.caseId,
        sk: caseRecord.caseId,
        ...caseRecord,
      },
      {
        pk: `${caseRecord.docketNumber}|case`,
        sk: caseRecord.caseId,
      },
      {
        pk: 'new|case-status',
        sk: caseRecord.caseId,
      },
      {
        pk: `${caseRecord.userId}|case`,
        sk: caseRecord.caseId,
      },
    ],
  });
  return caseRecord;
};

/**
 * createDocumentMetadata
 * @param documentToCreate
 * @param applicationContext
 * @returns {*}
 */
exports.createDocumentMetadata = ({ documentToCreate, applicationContext }) => {
  const entity = documentToCreate;
  const key = 'documentId';
  return client.put({
    TableName: `efcms-documents-${applicationContext.environment.stage}`,
    Item: entity,
    ConditionExpression: `attribute_not_exists(#${key})`,
    ExpressionAttributeNames: {
      [`#${key}`]: `${key}`,
    },
  });
};

/**
 * getCaseByCaseId
 * @param caseId
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseByCaseId = async ({ caseId, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  const results = await client.get({
    TableName: TABLE,
    Key: {
      pk: caseId,
      sk: caseId,
    },
  });
  return stripInternalKeys(results);
};

/**
 * getCaseByDocketNumber
 * @param docketNumber
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseByDocketNumber = async ({
  docketNumber,
  applicationContext,
}) => {
  return getRecordViaMapping({
    applicationContext,
    key: docketNumber,
    type: 'case',
  });
};

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

/**
 * saveCase
 * @param caseToSave
 * @param applicationContext
 * @returns {*}
 */
exports.saveCase = async ({ caseToSave, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  const currentCaseState = await client.get({
    TableName: TABLE,
    Key: {
      pk: caseToSave.caseId,
      sk: caseToSave.caseId,
    },
  });

  const currentStatus = currentCaseState.status;

  if (currentStatus !== caseToSave.status) {
    await client.delete({
      tableName: TABLE,
      key: {
        pk: `${currentStatus}|case-status`,
        sk: caseToSave.caseId,
      },
    });

    await client.put({
      TableName: TABLE,
      Item: {
        pk: `${caseToSave.status}|case-status`,
        sk: caseToSave.caseId,
      },
    });
  }

  const results = await client.put({
    TableName: TABLE,
    Item: {
      pk: caseToSave.caseId,
      sk: caseToSave.caseId,
      ...caseToSave,
    },
  });
  return stripInternalKeys(results);
};

/**
 * getCasesByUser
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByUser = ({ userId, applicationContext }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'case',
  });
};

/**
 * getCasesByIRSAttorney
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByIRSAttorney = async ({
  irsAttorneyId,
  applicationContext,
}) => {
  return getRecordsViaMapping({
    applicationContext,
    key: irsAttorneyId,
    type: 'activeCase',
  });
};

/**
 * getCasesByStatus
 * @param status
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByStatus = async ({ status, applicationContext }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: status,
    type: 'case-status',
  });
};
