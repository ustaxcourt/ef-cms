import { Database, DatabaseSchema } from '@web-api/database-schema';

export const getColumnsForTable = (table: keyof Database): any[] => {
  return DatabaseSchema[table].columns;
};
