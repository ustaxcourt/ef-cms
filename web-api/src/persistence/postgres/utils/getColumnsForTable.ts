import { Database, DatabaseSchema } from '@web-api/database-types';

export const getColumnsForTable = (table: keyof Database): any[] => {
  return DatabaseSchema[table].columns;
};
