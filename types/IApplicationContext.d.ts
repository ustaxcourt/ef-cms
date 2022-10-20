interface IApplicationContext {
  [key: string]: any;
  getPersistenceGateway: IGetPersistenceGateway;
  getUseCaseHelpers(): TUseCaseHelpers;
  getDispatchers(): TGetDispatchers;
}
