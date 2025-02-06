import {
  DW_CASE_COLUMNS,
  DW_CASE_STATISTIC_COLUMN,
  DW_CASE_STATUS_UPDATES_COLUMNS,
  DW_PETITIONERS_ON_CASE,
} from '@web-api/persistence/postgres/cases/mapper';

export const getColumnsForTable = (table: string) => {
  if (table === 'dwCase') {
    return DW_CASE_COLUMNS;
  }
  if (table === 'dwCaseStatusUpdate') {
    return DW_CASE_STATUS_UPDATES_COLUMNS;
  }
  if (table === 'dwPetitionerOnCase') {
    return DW_PETITIONERS_ON_CASE;
  }
  if (table === 'dwCaseStatistic') {
    return DW_CASE_STATISTIC_COLUMN
  }
  return [];
};
