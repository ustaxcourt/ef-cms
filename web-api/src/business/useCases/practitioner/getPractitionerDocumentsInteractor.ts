import {
  PractitionerDocument,
  RawPractitionerDocument,
} from '@shared/business/entities/PractitionerDocument';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPractitionerDocuments } from '@web-api/persistence/postgres/practitionerDocuments/getPractitionerDocuments';

export const getPractitionerDocumentsInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    barNumber,
  }: {
    barNumber: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawPractitionerDocument[]> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPLOAD_PRACTITIONER_DOCUMENT)
  ) {
    throw new UnauthorizedError(
      'Unauthorized for getting practitioner documents',
    );
  }

  const practitionerDocuments = await getPractitionerDocuments({
    barNumber,
  });

  return PractitionerDocument.validateRawCollection(practitionerDocuments, {
    applicationContext,
  });
};
