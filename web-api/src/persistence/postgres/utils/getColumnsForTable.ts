import { DatabaseSchema, DatabaseTableName } from '@web-api/database-types';

export const getColumnsForTable = (table: DatabaseTableName): any[] => {
  return DatabaseSchema[table].columns;
};
