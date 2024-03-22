/* eslint-disable no-unused-vars */
interface IApplicationContext {
  [key: string]: any;
  getNotificationGateway: IGetNotificationGateway;
  getUniqueId: () => string;
  getPersistenceGateway: IGetPersistenceGateway;
  getUseCaseHelpers: IGetUseCaseHelpers;
  getUseCases: IGetUseCases;
  getUtilities: IGetUtilities;
  getDocumentGenerators: IGetDocumentGenerators;
  getStorageClient: () => AWS.S3;
}
