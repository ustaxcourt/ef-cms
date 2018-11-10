const environment = require('../../environment');
const client = require('../../middleware/dynamodbClientService');

const getTable = type => {
  switch (type) {
  case 'document':
    return environment.get('DOCUMENTS_TABLE')
  case 'case':
    return environment.get('CASES_TABLE')
  default:
    throw new Error('type not found');
  }
}

exports.save = ({ entity, type }) =>
  client.put({
    TableName: getTable(type),
    Item: entity,
  });

