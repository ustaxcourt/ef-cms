import { AMENDED_PETITION_FORM_NAME } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const appendAmendedPetitionFormInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketEntryId }: { docketEntryId: string },
): Promise<void> => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.EDIT_ORDER,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: docketEntryId,
      useTempBucket: false,
    });

  const amendedPetitionFormData = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: AMENDED_PETITION_FORM_NAME,
    });

  const combinedPdf = await applicationContext.getUtilities().combineTwoPdfs({
    applicationContext,
    firstPdf: orderDocument,
    secondPdf: amendedPetitionFormData,
  });

  await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    pdfData: Buffer.from(combinedPdf),
    pdfName: docketEntryId,
  });
};
