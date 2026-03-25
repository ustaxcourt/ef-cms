import {
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';

export const columnData = [
  {
    columnName: 'Docket No.',
    sortFieldInfo: { sortField: 'docketNumber', sortType: 'string' },
  },
  {
    columnName: 'Case Title',
    sortFieldInfo: { sortField: 'caseCaption', sortType: 'string' },
  },
  {
    columnName: 'Opinion Type',
    sortFieldInfo: { sortField: 'documentType', sortType: 'string' },
  },
  {
    columnName: 'Pages',
    sortFieldInfo: { sortField: 'numberOfPages', sortType: 'number' },
  },
  {
    columnName: 'Date',
    sortFieldInfo: { sortField: 'filingDate', sortType: 'date' },
  },
  {
    columnName: 'Judge',
    sortFieldInfo: { sortField: 'formattedJudgeName', sortType: 'string' },
  },
];

export const SUPPORTED_SORT_FIELDS_FOR_TODAYS_OPINIONS = [
  'docketNumber',
  'caseCaption',
  'documentType',
  'numberOfPages',
  'filingDate',
  'formattedJudgeName',
];

export const sortOptions = [
  {
    label: 'Date (newest)',
    sortField: 'filingDate',
    sortOrder: DESCENDING,
  },
  {
    label: 'Date (oldest)',
    sortField: 'filingDate',
    sortOrder: ASCENDING,
  },
  {
    label: 'Pages (ascending)',
    sortField: 'numberOfPages',
    sortOrder: ASCENDING,
  },
  {
    label: 'Pages (descending)',
    sortField: 'numberOfPages',
    sortOrder: DESCENDING,
  },
  {
    label: 'Docket No. (ascending)',
    sortField: 'docketNumber',
    sortOrder: ASCENDING,
  },
  {
    label: 'Docket No. (descending)',
    sortField: 'docketNumber',
    sortOrder: DESCENDING,
  },
  {
    label: 'Case Title (ascending)',
    sortField: 'caseCaption',
    sortOrder: ASCENDING,
  },
  {
    label: 'Case Title (descending)',
    sortField: 'caseCaption',
    sortOrder: DESCENDING,
  },
  {
    label: 'Opinion Type (ascending)',
    sortField: 'documentType',
    sortOrder: ASCENDING,
  },
  {
    label: 'Opinion Type (descending)',
    sortField: 'documentType',
    sortOrder: DESCENDING,
  },
  {
    label: 'Judge (ascending)',
    sortField: 'formattedJudgeName',
    sortOrder: ASCENDING,
  },
  {
    label: 'Judge (descending)',
    sortField: 'formattedJudgeName',
    sortOrder: DESCENDING,
  },
];
