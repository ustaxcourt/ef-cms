interface IApplicationContext {
  [key: string]: any;
  getPersistenceGateway: IGetPersistenceGateway;
  getUseCaseHelpers: IGetUseCaseHelpers;
  getUseCases: IGetUseCases;
}
