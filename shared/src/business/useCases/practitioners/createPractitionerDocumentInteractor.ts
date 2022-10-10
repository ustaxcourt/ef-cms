import { Document } from '../../entities/Document';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * createPractitionerDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const createPractitionerDocumentInteractor = async (
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
    };
  },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(requestUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
  ) {
    throw new UnauthorizedError('Unauthorized for creating practitioner user');
  }

  const documentEntity: TPractitionerDocumentEntity = new Document(
    {
      categoryName: documentMetadata.categoryName,
      categoryType: documentMetadata.categoryType,
      documentId: documentMetadata.practitionerDocumentFileId,
      location: documentMetadata.location,
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
