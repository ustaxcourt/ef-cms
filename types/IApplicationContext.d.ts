/* eslint-disable no-unused-vars */
interface IApplicationContext {
  [key: string]: any;
  getUniqueId: () => string;
  getPersistenceGateway: IGetPersistenceGateway;
  getUseCaseHelpers: IGetUseCaseHelpers;
  getUseCases: IGetUseCases;
  getUtilities: IGetUtilities;
  getDocumentGenerators: IGetDocumentGenerators;
  getStorageClient: () => import('@aws-sdk/client-s3').S3;
}
