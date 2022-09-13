interface IApplicationContext {
  [key: string]: any;
  getPersistenceGateway(): TPersistenceGateway;
  getUseCaseHelpers(): TUseCaseHelpers;
  getDispatchers(): TGetDispatchers;
}
