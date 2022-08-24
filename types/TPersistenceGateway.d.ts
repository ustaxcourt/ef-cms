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

type TPersistenceGateway = {
  [key: string]: any;
  getUserById: IGetUserById;
  getWorkItemById: IGetWorkItemById;
  saveWorkItem: ISaveWorkItem;
  putWorkItemInOutbox: IPutWorkItemInOutbox;
  getCaseByDocketNumber: IGetCaseByDocketNumber;
};
