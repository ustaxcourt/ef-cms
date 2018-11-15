const environment = require('../../environment');
const client = require('../../middleware/dynamodbClientService');

const getTable = type => {
  switch (type) {
    case 'document':
      return environment.get('DOCUMENTS_TABLE');
    case 'case':
      return environment.get('CASES_TABLE');
    default:
      throw new Error('type not found');
  }
};

exports.get = ({ id, key, type }) =>
  client.get({
    TableName: getTable(type),
    Key: {
      [key]: id,
    },
  });

exports.save = ({ entity, type }) =>
  client.put({
    TableName: getTable(type),
    Item: entity,
  });

exports.getIndexName = key => {
  if (!key) return null;
  switch (key) {
    case 'user':
      return 'UserIdIndex';
    case 'status':
      return 'StatusIndex';
    default:
      throw new Error('invalid pivot key');
  }
};

exports.query = ({ type, query, pivot }) => {
  const values = {};
  const names = {};
  Object.keys(query).forEach(key => {
    values[`:${key}`] = query[key];
    names[`#${key}`] = key;
  });
  const expression = Object.keys(values)
    .map(key => {
      return `${key.replace(':', '#')} = ${key}`;
    })
    .join(' and ');

  return client.query({
    TableName: getTable(type),
    IndexName: exports.getIndexName(pivot),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    KeyConditionExpression: expression,
  });
};
