interface IApplicationContext {
  [key: string]: any;
  getPersistenceGateway(): TPersistenceGateway;
  getUseCaseHelpers(): TUseCaseHelpers;
}
