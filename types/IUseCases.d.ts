interface IAssignWorkItemsInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      assigneeId: string;
      assigneeName: string;
      workItemId: string;
    },
  ): Promise<void>;
}

interface ICompleteWorkItemInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      completedMessage: string;
      workItemId: string;
    },
  ): Promise<void>;
}

interface IGetDocumentQCInboxForSectionInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      judgeUserName: string;
      section: string;
    },
  ): Promise<void>;
}

interface IGetDocumentQCInboxForUserInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      userId: string;
    },
  ): Promise<void>;
}

interface ICreateCaseDeadlineInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      caseDeadline: TCaseDeadline;
    },
  ): Promise<TCaseDeadline>;
}

interface IGetDocumentQCServedForSectionInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      section: any;
    },
  ): Promise<TCaseDeadline>;
}

interface IGetWorkItemInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      workItemId: string;
    },
  ): Promise<WorkItem>;
}


