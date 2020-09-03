const { describeTable } = require('./dynamodbClientService');

export const getTableStatus = async ({ applicationContext }) => {
  const { Table } = await describeTable({ applicationContext });
  return Table.TableStatus;
};
