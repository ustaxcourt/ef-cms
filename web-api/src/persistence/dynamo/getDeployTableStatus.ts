import { describeDeployTable } from '../dynamodbClientService';

export const getDeployTableStatus = async ({ applicationContext }) => {
  const { Table } = await describeDeployTable({ applicationContext });
  return Table.TableStatus;
};
