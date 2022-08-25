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
  sentBy: string;
}

type WorkItem = {
  createdAt: string;
  assigneeId: string;
}

// TODO: confirm if section work item safely extends workitem
type TSectionWorkItem = WorkItem & { 
  docketEntry: DocketEntry[];
  docketNumber: string;
  docketNumberSuffix: string;
  messages: any;
  section: string;
  sentBy: string;
};

