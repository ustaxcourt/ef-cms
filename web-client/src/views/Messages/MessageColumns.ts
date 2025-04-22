export type MessageColumnData = {
  columnName: string;
  sortFieldInfo: SortFieldInfo;
  headerClassName?: string;
  headerIconClassName?: string;
};

type SortFieldInfo = {
  sortField: string; // What we are actually sorting by (e.g., a timestamp)
  displayField?: string; // What we are displaying (e.g., a formatted timestamp)
  sortType: 'string' | 'date';
};

// The fields that messages can be sorted by.
export const SORT_FIELDS: Record<string, SortFieldInfo> = {
  CASE_STATUS: { sortField: 'caseStatus', sortType: 'string' },
  CASE_TITLE: { sortField: 'caseTitle', sortType: 'string' },
  COMPLETED_AT: {
    displayField: 'completedAtFormatted',
    sortField: 'completedAt',
    sortType: 'date',
  },
  COMPLETED_BY: { sortField: 'completedBy', sortType: 'date' },
  COMPLETED_BY_SECTION: { sortField: 'completedBySection', sortType: 'string' },
  COMPLETED_MESSAGE: { sortField: 'completedMessage', sortType: 'string' },
  CREATED_AT: {
    displayField: 'createdAtFormatted',
    sortField: 'createdAt',
    sortType: 'date',
  },
  DOCKET_NUMBER: {
    displayField: 'docketNumberWithSuffix',
    sortField: 'docketNumber',
    sortType: 'string',
  },
  FROM: { sortField: 'from', sortType: 'string' },
  FROM_SECTION: { sortField: 'fromSectionFormatted', sortType: 'string' },
  SUBJECT: { sortField: 'subject', sortType: 'string' },
  TO: { sortField: 'to', sortType: 'string' },
  TO_SECTION: { sortField: 'toSection', sortType: 'string' },
};

// The columns we have available for any message queue.
export const SORTABLE_COLUMNS: Record<string, MessageColumnData> = {
  CASE_STATUS: {
    columnName: 'Case Status',
    sortFieldInfo: SORT_FIELDS.CASE_STATUS,
  },
  CASE_TITLE: {
    columnName: 'Case Title',
    sortFieldInfo: SORT_FIELDS.CASE_TITLE,
  },
  COMMENT: {
    columnName: 'Comment',
    sortFieldInfo: SORT_FIELDS.COMPLETED_MESSAGE,
  },
  COMPLETED_AT: {
    columnName: 'Completed',
    sortFieldInfo: SORT_FIELDS.COMPLETED_AT,
  },
  COMPLETED_BY: {
    columnName: 'Completed By',
    sortFieldInfo: SORT_FIELDS.COMPLETED_BY,
  },
  COMPLETED_BY_SECTION: {
    columnName: 'Section',
    sortFieldInfo: SORT_FIELDS.COMPLETED_BY_SECTION,
  },
  DOCKET_NUMBER: {
    columnName: 'Docket No.',
    headerIconClassName: 'consolidated-case-column',
    sortFieldInfo: SORT_FIELDS.DOCKET_NUMBER,
  },
  FROM: {
    columnName: 'From',
    sortFieldInfo: SORT_FIELDS.FROM,
  },
  FROM_SECTION: {
    columnName: 'Section',
    sortFieldInfo: SORT_FIELDS.FROM_SECTION,
  },
  LAST_MESSAGE: {
    // For completed message threads
    columnName: 'Last Message',
    sortFieldInfo: SORT_FIELDS.SUBJECT,
  },
  MESSAGE: {
    columnName: 'Message',
    sortFieldInfo: SORT_FIELDS.SUBJECT,
  },
  MESSAGE_WITH_UNREAD_ICON: {
    columnName: 'Message',
    headerIconClassName: 'message-unread-column',
    sortFieldInfo: SORT_FIELDS.SUBJECT,
  },
  RECEIVED: {
    columnName: 'Received',
    sortFieldInfo: SORT_FIELDS.CREATED_AT,
  },
  SENT: {
    columnName: 'Sent',
    sortFieldInfo: SORT_FIELDS.CREATED_AT,
  },
  TO: {
    columnName: 'To',
    sortFieldInfo: SORT_FIELDS.TO,
  },
  TO_SECTION: {
    columnName: 'Section',
    sortFieldInfo: SORT_FIELDS.TO_SECTION,
  },
};
