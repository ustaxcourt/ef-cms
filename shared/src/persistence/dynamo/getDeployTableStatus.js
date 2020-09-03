const { describeDeployTable } = require('../dynamodbClientService');

exports.getDeployTableStatus = async ({ applicationContext }) => {
  const { Table } = await describeDeployTable({ applicationContext });
  return Table.TableStatus;
};
