const client = require('./dynamodbClientService');
const Case = require('../entities/Case');

const getTable = (entity, stage) => {
  if (entity instanceof Case || entity.entityType === 'case') {
    return `efcms-cases-${stage}`;
  } else {
    throw new Error('entity type not found');
  }
};

const getKey = entity => {
  if (entity instanceof Case || entity.entityType === 'case') {
    return 'caseId';
  } else {
    throw new Error('entity type not found');
  }
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

exports.get = ({ entity, applicationContext }) => {
  const key = getKey(entity);
  return client.get({
    TableName: getTable(entity, applicationContext.environment.stage),
    Key: {
      [key]: entity[key],
    },
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
