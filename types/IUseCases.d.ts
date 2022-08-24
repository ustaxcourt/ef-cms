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

interface ICreateCaseDeadlineInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      caseDeadline: TCaseDeadline;
    },
  ): Promise<TCaseDeadline>;
}