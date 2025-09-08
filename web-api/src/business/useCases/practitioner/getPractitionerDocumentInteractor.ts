import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPractitionerDocumentByFileId } from '@web-api/persistence/postgres/practitionerDocuments/getPractitionerDocumentByFileId';
import {
  PractitionerDocument,
  RawPractitionerDocument,
} from '@shared/business/entities/PractitionerDocument';

export const getPractitionerDocumentInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    barNumber,
    practitionerDocumentFileId,
  }: {
    barNumber: string;
    practitionerDocumentFileId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawPractitionerDocument> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  let practitionerDocument: RawPractitionerDocument =
    await getPractitionerDocumentByFileId({
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
