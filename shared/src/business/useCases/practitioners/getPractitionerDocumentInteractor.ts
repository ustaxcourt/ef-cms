import { PractitionerDocument } from '../../entities/PractitionerDocument';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.barNumber the bar number of the practitioner
 * @param {string} providers.practitionerDocumentFileId the key of the document
 * @returns {Array<string>} the filing type options based on user role
 */
export const getPractitionerDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    barNumber,
    practitionerDocumentFileId,
  }: {
    barNumber: string;
    practitionerDocumentFileId: string;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let practitionerDocument = await applicationContext
    .getPersistenceGateway()
    .getPractitionerDocumentByFileId({
      applicationContext,
      barNumber,
      fileId: practitionerDocumentFileId,
    });

  practitionerDocument = new PractitionerDocument(practitionerDocument, {
    applicationContext,
  })
    .validate()
    .toRawObject();

  return practitionerDocument;
};
