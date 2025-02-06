import { DW_CASE_COLUMNS } from '@web-api/persistence/postgres/cases/mapper';

export const getColumnsForTable = (table: string) => {
  if (table === 'dwCase') {
    return DW_CASE_COLUMNS;
  }
  return [];
};
