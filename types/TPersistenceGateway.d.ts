interface IGetUserById {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): any;
}

interface IGetWorkItemById {
  ({
    applicationContext,
    workItemId,
  }: {
    applicationContext: IApplicationContext;
    workItemId: string;
  }): any;
}

interface ISaveWorkItem {
  ({
    applicationContext,
    workItem,
  }: {
    applicationContext: IApplicationContext;
    workItem: any;
  }): any;
}

type TPersistenceGateway = {
  [key: string]: any;
  getUserById: IGetUserById;
  getWorkItemById: IGetWorkItemById;
  saveWorkItem: ISaveWorkItem;
};
