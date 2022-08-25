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
interface IGetDocumentQCServedForUserInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      userId: string;
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

interface ICreateMessageInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      attachments: {
        documentId: string;
      }[];
      docketNumber: string;
      message: string;
      subject: string;
      toSection: string;
      toUserId: string;
    },
  ): Promise<TMessageData>;
}

interface ICompleteMessageInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      message: string;
      parentMessageId: string;
    },
  ): Promise<TMessageData>;
}

interface IGetCompletedMessagesForSectionInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      section: string;
    },
  ): Promise<TMessageData>;
}

interface IGetCompletedMessagesForUserInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      userId: string;
    },
  ): Promise<TMessageData[]>;
}

interface IGetInboxMessagesForSectionInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      section: string;
    },
  ): Promise<TMessageData[]>;
}

interface IGetInboxMessagesForUserInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      userId: string;
    },
  ): Promise<TMessageData[]>;
}

interface IGetMessagesForCaseInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      docketNumber: string;
    },
  ): Promise<TMessageData[]>;
}

interface IGetMessageThreadInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      parentMessageId: string;
    },
  ): Promise<TMessageData[]>;
}

interface IGetOutboxMessagesForSectionInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      section: string;
    },
  ): Promise<TMessageData[]>;
}

interface IGetOutboxMessagesForUserInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      userId: string;
    },
  ): Promise<TMessageData[]>;
}

interface IReplyToMessageInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      attachments: any[];
      docketNumber: string;
      message: string;
      parentMessageId: string;
      subject: string;
      toSection: string;
      toUserId: string;
    },
  ): Promise<TMessageData[]>;
}

interface ISetMessageAsReadInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      docketNumber: string;
      messageId: string;
    },
  ): Promise<void>;
}

interface IValidateCreateMessageInteractor {
  (
    applicationContext: IApplicationContext,
    options: {
      message: {
        message: string;
        subject: string;
        toSection: string;
        toUserId: string;
      };
    },
  ): any;
}
