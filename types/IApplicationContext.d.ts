/* eslint-disable no-unused-vars */
interface IApplicationContext {
  [key: string]: any;
  getPersistenceGateway: IGetPersistenceGateway;
  getUseCaseHelpers: IGetUseCaseHelpers;
  getUseCases: IGetUseCases;
  getUtilities: IGetUtilities;
  getDocumentGenerators: IGetDocumentGenerators;
}
