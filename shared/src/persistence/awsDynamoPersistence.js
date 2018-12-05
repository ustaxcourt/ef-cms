const client = require('./dynamodbClientService');
const Case = require('../business/entities/Case');
const Document = require('../business/entities/Document');

/**
 * getTable
 * @param entity
 * @param stage
 * @returns {string}
 */
const getTable = (entity, stage) => {
  if (entity instanceof Case || entity.entityType === 'case') {
    return `efcms-cases-${stage}`;
  } else if (entity instanceof Document || entity.entityType === 'document') {
    return `efcms-documents-${stage}`;
  } else {
    throw new Error('entity type not found');
  }
};

/**
 * getKey
 *
 * @param entity
 * @returns {string}
 */
const getKey = entity => {
  if (entity instanceof Case || entity.entityType === 'case') {
    return 'caseId';
  } else if (entity instanceof Document || entity.entityType === 'document') {
    return 'documentId';
  } else {
    throw new Error('entity type not found');
  }
};

/**
 * createCase
 * @param caseRecord
 * @param applicationContext
 * @returns {*}
 */
exports.createCase = ({ caseRecord, applicationContext }) => {
  return this.create({ entity: caseRecord, applicationContext });
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
  const entity = {
    caseId,
    entityType: 'case',
  };

  return this.get({ entity, applicationContext });
};
/**
 * get
 * @param entity
 * @param applicationContext
 * @returns {*}
 */
//TODO should not be exported
exports.get = ({ entity, applicationContext }) => {
  const key = getKey(entity);
  return client.get({
    TableName: getTable(entity, applicationContext.environment.stage),
    Key: {
      [key]: entity[key],
    },
  });
};
/**
 * getCaseByDocketNumber
 * @param docketNumber
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseByDocketNumber = ({ docketNumber, applicationContext }) => {
  return client.query({
    TableName: getTable(
      { entityType: 'case' },
      applicationContext.environment.stage,
    ),
    IndexName: 'DocketNumberIndex',
    ExpressionAttributeNames: {
      '#docketNumber': 'docketNumber',
    },
    ExpressionAttributeValues: {
      ':docketNumber': docketNumber,
    },
    KeyConditionExpression: '#docketNumber = :docketNumber',
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
  return client.updateConsistent({
    TableName: `efcms-cases-${applicationContext.environment.stage}`,
    Key: {
      caseId: 'docketNumberCounter',
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
  return client.put({
    TableName: getTable(
      { entityType: 'case' },
      applicationContext.environment.stage,
    ),
    Item: caseToSave,
  });
};

/**
 * getCasesByUser
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByUser = ({ userId, applicationContext }) =>
  client.query({
    TableName: getTable(
      { entityType: 'case' },
      applicationContext.environment.stage,
    ),
    IndexName: 'UserIdIndex',
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    KeyConditionExpression: '#userId = :userId',
  });

/**
 * getCasesByIRSAttorney
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByIRSAttorney = async ({ irsAttorneyId, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  const activeCaseMapping = await client.query({
    TableName: TABLE,
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${irsAttorneyId}|activeCase`,
    },
    KeyConditionExpression: '#pk = :pk',
  });
  const activeCaseIds = activeCaseMapping.map(metadata => metadata.sk);

  const activeCases = await client.batchGet({
    RequestItems: {
      [`efcms-cases-${applicationContext.environment.stage}`]: {
        Keys: activeCaseIds.map(activeCaseId => ({
          caseId: activeCaseId,
        }))
      }
    }
  })
  console.log('we are here', activeCases);
  return activeCases;
}
  
/**
 * getCasesByStatus
 * @param status
 * @param applicationContext
 * @returns {*}
 */
exports.getCasesByStatus = ({ status, applicationContext }) =>
  client.query({
    TableName: getTable(
      { entityType: 'case' },
      applicationContext.environment.stage,
    ),
    IndexName: 'StatusIndex',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
    },
    KeyConditionExpression: '#status = :status',
  });
