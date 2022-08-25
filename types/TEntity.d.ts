type TCaseDeadline = {
  associatedJudge: string;
  caseDeadlineId: number;
  createdAt: Date;
  deadlineDate: Date;
  description: string;
  docketNumber: string;
  sortableDocketNumber: string;
};

type DocketEntry = {
  additionalInfo: string;
  descriptionDisplay: string;
  docketEntryId: string;
  documentTitle: string;
  documentType: string;
  eventCode: string;
  filedBy: string;
  index: string;
  isFileAttached: string;
  isPaper: string;
  otherFilingParty: string;
  receivedAt: string;
  sentBy: string;
  servedAt: string;
  userId: string;
}

type WorkItem = {
  createdAt: string;
  assigneeId: string;
  docketEntry: DocketEntry;
  docketNumber: string;
}

type TSectionWorkItem = WorkItem & { 
  docketEntry: DocketEntry;
  docketNumber: string;
  docketNumberSuffix: string;
  messages: any;
  section: string;
  sentBy: string;
}

