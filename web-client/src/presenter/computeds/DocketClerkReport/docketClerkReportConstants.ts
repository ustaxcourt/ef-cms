export const DOCKET_CLERK_REPORT_PAGE_TYPES = {
  documentQC: 'documentQC',
  messages: 'messages',
} as const;

export type DocketClerkReportPageType =
  (typeof DOCKET_CLERK_REPORT_PAGE_TYPES)[keyof typeof DOCKET_CLERK_REPORT_PAGE_TYPES];

export const DOCKET_CLERK_REPORT_PAGE_TYPE_OPTIONS: {
  key: DocketClerkReportPageType;
  label: string;
}[] = [
  { key: DOCKET_CLERK_REPORT_PAGE_TYPES.documentQC, label: 'Document QC' },
  { key: DOCKET_CLERK_REPORT_PAGE_TYPES.messages, label: 'Messages' },
];

export type DocketClerkReportBox =
  | 'inbox'
  | 'inProgress'
  | 'processed'
  | 'sent'
  | 'completed';
