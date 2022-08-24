interface IGetUserById {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<any>;
}

interface IGetWorkItemById {
  ({
    applicationContext,
    workItemId,
  }: {
    applicationContext: IApplicationContext;
    workItemId: string;
  }): Promise<any>;
}

interface IPutWorkItemInOutbox{
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
  }): Promise<any>;
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

type TPersistenceGateway = {
  [key: string]: any;
  createCaseDeadline: ICreateCaseDeadline;
  getCaseByDocketNumber: IGetCaseByDocketNumber;
  getUserById: IGetUserById;
  getWorkItemById: IGetWorkItemById;
  putWorkItemInOutbox: IPutWorkItemInOutbox;
  saveWorkItem: ISaveWorkItem;
};
