const client = require('./dynamodbClientService');
const Case = require('../entities/Case');

const getTable = (entity, stage) => {
  if (entity instanceof Case) {
    return `efcms-cases-${stage}`;
  } else {
    throw new Error('entity type not found');
  }
};

const getKey = entity => {
  if (entity instanceof Case) {
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
