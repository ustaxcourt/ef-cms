const client = require('./dynamodbClientService');
const Case = require('../business/entities/Case');
const Document = require('../business/entities/Document');

const getTable = (entity, stage) => {
  if (entity instanceof Case || entity.entityType === 'case') {
    return `efcms-cases-${stage}`;
  } else if (entity instanceof Document || entity.entityType === 'document') {
    return `efcms-documents-${stage}`;
  } else {
    throw new Error('entity type not found');
  }
}

const getKey = entity => {
  if (entity instanceof Case || entity.entityType === 'case') {
    return 'caseId';
  } else if (entity instanceof Document || entity.entityType === 'document') {
    return 'documentId';
  } else {
    throw new Error('entity type not found');
  }
}

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

  return await client.batchGet({
    tableName: TABLE,
    keys: ids.map(id => ({
      pk: id,
      sk: id,
    }))
  });
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

  return await client.get({
    tableName: TABLE,
    Key: {
      pk: key,
      sk: key,
    },
  });
};

/**
 * createCase
 * @param caseRecord
 * @param applicationContext
 * @returns {*}
 */
exports.createCase = async ({ caseRecord, applicationContext }) => {
  const result = await client.batchWrite({
    tableName: `efcms-${applicationContext.environment.stage}`,
    items: [
      {
        pk: caseRecord.caseId,
        sk: caseRecord.caseId,
        ...caseRecord
      },
      {
        pk: `${caseRecord.docketNumber}|case`,
        sk: caseRecord.caseId,
      },
      {
        pk: "new|case-status",
        sk: caseRecord.caseId,
      },
      {
        pk: `${caseRecord.userId}|case`,
        sk: caseRecord.caseId,
      }
    ]
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
  return this.create({ entity: documentToCreate, applicationContext });
};

/**
 * create
 * @param entity
 * @param applicationContext
 * @returns {*}
 */
exports.create = ({ entity, applicationContext }) => {
  const key = getKey(entity);
  return client.put({
    TableName: getTable(entity, applicationContext.environment.stage),
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
exports.getCaseByCaseId = ({ caseId, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  return client.get({
    TableName: TABLE,
    Key: {
      pk: caseId,
      sk: caseId,
    },
  });
};

/**
 * getCaseByDocketNumber
 * @param docketNumber
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseByDocketNumber = async ({ docketNumber, applicationContext }) => {
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
exports.incrementCounter = applicationContext => {
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
exports.saveCase = ({ caseToSave, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;

  return client.put({
    TableName: TABLE,
    Item: caseToSave,
  });
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
}

/**
 * getCasesByIRSAttorney
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByIRSAttorney = async ({ irsAttorneyId, applicationContext }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: irsAttorneyId,
    type: 'activeCase',
  });
}
  
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
}