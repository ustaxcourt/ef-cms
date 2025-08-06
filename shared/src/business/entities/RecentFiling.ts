export interface RecentFiling {
  docketNumber: string;
  filedDate: string;
  document: string;
  caseTitle: string;
  docketEntryId: string;
  isFileAttached?: boolean;
  eventCode?: string;
  isStricken?: boolean;
  isSealed?: boolean;
  sealedTo?: string;
  servedAt?: string;
  inConsolidatedGroup?: boolean;
  isLeadCase?: boolean;
  consolidatedIconTooltipText?: string;
}
