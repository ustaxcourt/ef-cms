const client = require('./dynamodbClientService');
const Case = require('../entities/Case');

const getTable = entity => {
  if (entity instanceof Case) {
    return `efcms-cases-${process.env.STAGE}`;
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

exports.create = entity => {
  const key = getKey(entity);
  return client.put({
    TableName: getTable(entity),
    Item: entity,
    ConditionExpression: `attribute_not_exists(#${key})`,
    ExpressionAttributeNames: {
      [`#${key}`]: `${key}`,
    },
  });
};
