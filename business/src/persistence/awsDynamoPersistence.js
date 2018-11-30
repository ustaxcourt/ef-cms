const client = require('./dynamodbClientService');
const Case = require('../entities/Case');
const Document = require('../entities/Document');

const getTable = (entity, stage) => {
  if (entity instanceof Case || entity.entityType === 'case') {
    return `efcms-cases-${stage}`;
  } else if (entity instanceof Document || entity.entityType === 'document') {
    return `efcms-documents-${stage}`;
  } else {
    throw new Error('entity type not found');
  }
};

const getKey = entity => {
  if (entity instanceof Case || entity.entityType === 'case') {
    return 'caseId';
  } else if (entity instanceof Document || entity.entityType === 'document') {
    return 'documentId';
  } else {
    throw new Error('entity type not found');
  }
};

exports.createCase = ({ caseRecord, applicationContext }) => {
  return this.create({ entity: caseRecord, applicationContext });
};

exports.createDocumentMetadata = ({ documentToCreate, applicationContext }) => {
  return this.create({ entity: documentToCreate, applicationContext });
};

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

exports.getCaseByCaseId = ({ caseId, applicationContext }) => {
  const entity = {
    caseId,
    entityType: 'case',
  };

  return this.get({ entity, applicationContext });
};

exports.get = ({ entity, applicationContext }) => {
  const key = getKey(entity);
  return client.get({
    TableName: getTable(entity, applicationContext.environment.stage),
    Key: {
      [key]: entity[key],
    },
  });
};

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

exports.saveCase = ({ caseToSave, applicationContext }) =>
  client.put({
    TableName: getTable(
      { entityType: 'case' },
      applicationContext.environment.stage,
    ),
    Item: caseToSave,
  });

exports.sendToIRS = ({ caseToSend }) => {
  return caseToSend;
  // noop on irs for now
};

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
