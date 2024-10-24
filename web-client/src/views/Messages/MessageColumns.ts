export interface MessageColumnData {
  columnName: string;
  sortField: string;
  sortFieldDisplay?: string;
  sortType?: 'string' | 'date';
  className?: string;
  dataTestId?: string;
  iconClassName?: string;
}

export const COLUMN_NAMES = {
  CASE_STATUS: 'Case Status',
  CASE_TITLE: 'Case Title',
  COMMENT: 'Comment',
  COMPLETED: 'Completed',
  DOCKET_NUMBER: 'Docket No.',
  FROM: 'From',
  LAST_MESSAGE: 'Last Message',
  MESSAGE: 'Message',
  RECEIVED: 'Received',
  SECTION: 'Section',
  SENT: 'Sent',
  TO: 'To',
};

const getOneColumnData = (columnName: string) => {
  return columns.find(column => column.columnName === columnName)!;
};

export const getColumnData = (columnNames: string[]) => {
  return columnNames.map(field => getOneColumnData(field));
};

export const columns: MessageColumnData[] = [
  {
    columnName: COLUMN_NAMES.DOCKET_NUMBER,
    dataTestId: 'message-individual-docket-number',
    iconClassName: 'consolidated-case-column',
    sortField: 'docketNumber',
  },
  {
    columnName: COLUMN_NAMES.RECEIVED,
    dataTestId: 'message-individual-received',
    sortField: 'createdAt',
    sortFieldDisplay: 'createdAtFormatted',
  },
  {
    columnName: COLUMN_NAMES.SENT,
    dataTestId: 'message-individual-received',
    sortField: 'createdAt',
    sortFieldDisplay: 'createdAtFormatted',
  },
  {
    columnName: COLUMN_NAMES.COMPLETED,
    dataTestId: 'message-individual-received',
    sortField: 'completedAt',
    sortFieldDisplay: 'completedAtFormatted',
  },
  {
    columnName: COLUMN_NAMES.LAST_MESSAGE,
    dataTestId: 'message-individual-subject',
    iconClassName: 'message-unread-column',
    sortField: 'subject',
  },
  {
    columnName: COLUMN_NAMES.MESSAGE,
    dataTestId: 'message-individual-subject',
    iconClassName: 'message-unread-column',
    sortField: 'subject',
  },
  {
    columnName: COLUMN_NAMES.CASE_TITLE,
    dataTestId: 'message-individual-case-title',
    sortField: 'caseTitle',
  },
  {
    columnName: COLUMN_NAMES.CASE_STATUS,
    dataTestId: 'message-individual-case-status',
    sortField: 'caseStatus',
  },
  {
    columnName: COLUMN_NAMES.TO,
    dataTestId: 'message-individual-from',
    sortField: 'to',
  },
  {
    columnName: COLUMN_NAMES.FROM,
    dataTestId: 'message-individual-from',
    sortField: 'from',
  },
  {
    columnName: COLUMN_NAMES.SECTION,
    dataTestId: 'message-individual-section',
    sortField: 'fromSectionFormatted',
  },
  {
    columnName: COLUMN_NAMES.COMMENT,
    dataTestId: 'message-individual-comment',
    sortField: 'completedMessage',
  },
];
