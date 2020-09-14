const { describeTable } = require('../dynamodbClientService');

exports.getTableStatus = async ({ applicationContext }) => {
  const { Table } = await describeTable({ applicationContext });
  return Table.TableStatus;
};
