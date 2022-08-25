interface IGetUserById {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TUser>;
}

interface IGetWorkItemById {
  ({
    applicationContext,
    workItemId,
  }: {
    applicationContext: IApplicationContext;
    workItemId: string;
  }): Promise<WorkItem>;
}

interface IPutWorkItemInOutbox {
  ({
    applicationContext,
    workItem,
  }: {
    applicationContext: IApplicationContext;
    workItem: any;
  }): Promise<any>;
}

interface ISaveWorkItem {
  ({
    applicationContext,
    workItem,
  }: {
    applicationContext: IApplicationContext;
    workItem: any;
  }): Promise<any>;
}

interface IGetCaseByDocketNumber {
  ({
    applicationContext,
    docketNumber,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
  }): Promise<TCase>;
}

interface IGetDocumentQCInboxForSection {
  ({
    applicationContext,
    section,
    judgeUserName,
  }: {
    applicationContext: IApplicationContext;
    section: any;
    judgeUserName: string;
  }): TSectionWorkItem[];
}
interface ICreateCaseDeadline {
  ({
    applicationContext,
    caseDeadline,
  }: {
    applicationContext: IApplicationContext;
    caseDeadline: TCaseDeadline;
  }): any;
}

interface IGetDocumentQCServedForSection {
  ({
    applicationContext,
    afterDate,
    section,
  }: {
    applicationContext: IApplicationContext;
    afterDate: string;
    section: TSectionWorkItem;
  }): any;
}

interface IGetConfigurationItemValue {
  ({
    applicationContext,
    configurationItemKey,
  }: {
    applicationContext: IApplicationContext;
    configurationItemKey: string;
  }): string;
}

interface IUpdateDocketEntry {
  ({
    applicationContext,
    docketEntryId,
  }: {
    applicationContext: IApplicationContext;
    docketEntryId: string;
    docketNumber: string;
    document: any;
  }): Promise<any>;
}

interface ICreateMessage {
  ({
    applicationContext,
    message,
  }: {
    applicationContext: IApplicationContext;
    message: TMessage;
  }): Promise<void>;
}

type TPersistenceGateway = {
  [key: string]: any;
  createCaseDeadline: ICreateCaseDeadline;
  getCaseByDocketNumber: IGetCaseByDocketNumber;
  getUserById: IGetUserById;
  getWorkItemById: IGetWorkItemById;
  putWorkItemInOutbox: IPutWorkItemInOutbox;
  getDocumentQCInboxForSection: IGetDocumentQCInboxForSection;
  saveWorkItem: ISaveWorkItem;
  getDocumentQCServedForSection: IGetDocumentQCServedForSection;
  getConfigurationItemValue: IGetConfigurationItemValue;
  updateDocketEntry: IUpdateDocketEntry;
  createMessage: ICreateMessage;
};
