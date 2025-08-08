export interface RecentFiling {
  docketNumber: string;
  filedDate: string;
  document: string;
  caseTitle: string;
  docketEntryId: string;
  isFileAttached?: boolean | null;
  eventCode?: string;
  isStricken?: boolean | null;
  isSealed?: boolean | null;
  sealedTo?: string | null;
  servedAt?: string;
  inConsolidatedGroup?: boolean;
  isLeadCase?: boolean;
  consolidatedIconTooltipText?: string;
}
