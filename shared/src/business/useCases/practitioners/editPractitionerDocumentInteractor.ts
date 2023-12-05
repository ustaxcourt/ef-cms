import { PractitionerDocument } from '../../entities/PractitionerDocument';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * editPractitionerDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const editPractitionerDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    barNumber,
    documentMetadata,
  }: {
    barNumber: string;
    documentMetadata: {
      categoryName;
      categoryType: string;
      description?: string;
      location?: string;
      practitionerDocumentFileId: string;
      fileName: string;
      uploadDate: string;
    };
  },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(requestUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
  ) {
    throw new UnauthorizedError('Unauthorized for creating practitioner user');
  }

  const documentEntity = new PractitionerDocument(
    {
      categoryName: documentMetadata.categoryName,
      categoryType: documentMetadata.categoryType,
      description: documentMetadata.description,
      fileName: documentMetadata.fileName,
      location: documentMetadata.location,
      practitionerDocumentFileId: documentMetadata.practitionerDocumentFileId,
      uploadDate: documentMetadata.uploadDate,
    },
    { applicationContext },
  );

  await applicationContext.getPersistenceGateway().editPractitionerDocument({
    applicationContext,
    barNumber,
    practitionerDocument: documentEntity.validate().toRawObject(),
  });

  return documentEntity.toRawObject();
};
