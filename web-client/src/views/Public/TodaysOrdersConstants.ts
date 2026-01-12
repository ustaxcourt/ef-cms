import {
  ASCENDING,
  DESCENDING,
} from '@shared/business/entities/EntityConstants';

export const columnData = [
  {
    columnName: 'Time Filed',
    sortFieldInfo: { sortField: 'filingDate', sortType: 'date' },
  },
  {
    columnName: 'Docket No.',
    sortFieldInfo: { sortField: 'docketNumber', sortType: 'string' },
  },
  {
    columnName: 'Case Title',
    sortFieldInfo: { sortField: 'caseCaption', sortType: 'string' },
  },
  {
    columnName: 'Order',
    sortFieldInfo: { sortField: 'documentTitle', sortType: 'string' },
  },
  {
    columnName: 'Pages',
    sortFieldInfo: { sortField: 'numberOfPages', sortType: 'number' },
  },
  {
    columnName: 'Judge',
    sortFieldInfo: { sortField: 'formattedJudgeName', sortType: 'string' },
  },
];

export const SUPPORTED_SORT_FIELDS_FOR_TODAYS_ORDERS = [
  'filingDate',
  'caseCaption',
  'documentTitle',
  'numberOfPages',
  'formattedJudgeName',
];

export const sortOptions = [
  {
    label: 'Newest',
    sortField: 'filingDate',
    sortOrder: DESCENDING,
  },
  {
    label: 'Oldest',
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
    label: 'Order (ascending)',
    sortField: 'documentTitle',
    sortOrder: ASCENDING,
  },
  {
    label: 'Order (descending)',
    sortField: 'documentTitle',
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
