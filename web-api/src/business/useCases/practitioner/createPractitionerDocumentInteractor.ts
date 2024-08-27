import { PractitionerDocument } from '../../../../../shared/src/business/entities/PractitionerDocument';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * createPractitionerDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const createPractitionerDocumentInteractor = async (
  applicationContext: ServerApplicationContext,
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
    };
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
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
    },
    { applicationContext },
  );

  await applicationContext.getPersistenceGateway().createPractitionerDocument({
    applicationContext,
    barNumber,
    practitionerDocument: documentEntity.validate().toRawObject(),
  });

  return documentEntity.toRawObject();
};
