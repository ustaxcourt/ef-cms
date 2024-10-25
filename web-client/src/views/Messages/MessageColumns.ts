export interface MessageColumnData {
  columnName: string;
  sortFieldInfo: SortFieldInfo;
  sortType?: 'string' | 'date';
  headerClassName?: string;
  dataTestId?: string;
  headerIconClassName?: string;
}

type SortFieldInfo = {
  sortField: string; // What we are actually sorting by (e.g., a timestamp)
  displayField?: string; // What we are displaying (e.g., a formatted timestamp)
};

// The fields that messages can be sorted by.
export const SORT_FIELDS: Record<string, SortFieldInfo> = {
  CASE_STATUS: { sortField: 'caseStatus' },
  CASE_TITLE: { sortField: 'caseTitle' },
  COMPLETED_AT: {
    displayField: 'completedAtFormatted',
    sortField: 'completedAt',
  },
  COMPLETED_BY: { sortField: 'completedBy' },
  COMPLETED_BY_SECTION: { sortField: 'completedBySection' },
  COMPLETED_MESSAGE: { sortField: 'completedMessage' },
  CREATED_AT: { displayField: 'createdAtFormatted', sortField: 'createdAt' },
  DOCKET_NUMBER: {
    displayField: 'docketNumberWithSuffix',
    sortField: 'docketNumber',
  },
  FROM: { sortField: 'from' },
  FROM_SECTION: { sortField: 'fromSectionFormatted' },
  SUBJECT: { sortField: 'subject' },
  TO: { sortField: 'to' },
  TO_SECTION: { sortField: 'toSection' },
};

// The columns we have available for any message queue.
export const SORTABLE_COLUMNS: Record<string, MessageColumnData> = {
  CASE_STATUS: {
    columnName: 'Case Status',
    dataTestId: 'message-individual-case-status',
    sortFieldInfo: SORT_FIELDS.CASE_STATUS,
  },
  CASE_TITLE: {
    columnName: 'Case Title',
    dataTestId: 'message-individual-case-title',
    sortFieldInfo: SORT_FIELDS.CASE_TITLE,
  },
  COMMENT: {
    columnName: 'Comment',
    dataTestId: 'message-individual-comment',
    sortFieldInfo: SORT_FIELDS.COMPLETED_MESSAGE,
  },
  COMPLETED_AT: {
    columnName: 'Completed',
    dataTestId: 'message-individual-completed',
    sortFieldInfo: SORT_FIELDS.COMPLETED_AT,
  },
  COMPLETED_BY: {
    columnName: 'Completed By',
    dataTestId: 'message-individual-completed',
    sortFieldInfo: SORT_FIELDS.COMPLETED_BY,
  },
  COMPLETED_BY_SECTION: {
    columnName: 'Section',
    dataTestId: 'message-individual-completed',
    sortFieldInfo: SORT_FIELDS.COMPLETED_BY_SECTION,
  },
  DOCKET_NUMBER: {
    columnName: 'Docket No.',
    dataTestId: 'message-individual-docket-number',
    headerIconClassName: 'consolidated-case-column',
    sortFieldInfo: SORT_FIELDS.DOCKET_NUMBER,
  },
  FROM: {
    columnName: 'From',
    dataTestId: 'message-individual-from',
    sortFieldInfo: SORT_FIELDS.FROM,
  },
  FROM_SECTION: {
    columnName: 'Section',
    dataTestId: 'message-individual-section',
    sortFieldInfo: SORT_FIELDS.FROM_SECTION,
  },
  LAST_MESSAGE: {
    columnName: 'Last Message',
    dataTestId: 'message-individual-subject',
    headerIconClassName: 'message-unread-column',
    sortFieldInfo: SORT_FIELDS.SUBJECT,
  },
  MESSAGE: {
    columnName: 'Message',
    dataTestId: 'message-individual-subject',
    headerIconClassName: 'message-unread-column',
    sortFieldInfo: SORT_FIELDS.SUBJECT,
  },
  RECEIVED: {
    columnName: 'Received',
    dataTestId: 'message-individual-received',
    sortFieldInfo: SORT_FIELDS.CREATED_AT,
  },
  SENT: {
    columnName: 'Sent',
    dataTestId: 'message-individual-sent',
    sortFieldInfo: SORT_FIELDS.CREATED_AT,
  },
  TO: {
    columnName: 'To',
    dataTestId: 'message-individual-from',
    sortFieldInfo: SORT_FIELDS.TO,
  },
  TO_SECTION: {
    columnName: 'Section',
    dataTestId: 'message-section-to-section',
    sortFieldInfo: SORT_FIELDS.TO_SECTION,
  },
};
