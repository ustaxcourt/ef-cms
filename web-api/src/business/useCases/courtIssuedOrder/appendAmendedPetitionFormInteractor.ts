import { AMENDED_PETITION_FORM_NAME } from '../../../../../shared/src/business/entities/EntityConstants';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';

/**
 *
 * appendAmendedPetitionFormInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docketEntryId of the document
 */
export const appendAmendedPetitionFormInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketEntryId }: { docketEntryId: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.EDIT_ORDER,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  let orderDocument;
  try {
    orderDocument = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: docketEntryId,
        useTempBucket: false,
      });
  } catch (e) {
    throw new NotFoundError(`Docket entry ${docketEntryId} was not found`);
  }

  const { Body: amendedPetitionFormData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: AMENDED_PETITION_FORM_NAME,
    })
    .promise();

  const combinedPdf = await applicationContext.getUtilities().combineTwoPdfs({
    applicationContext,
    firstPdf: orderDocument,
    secondPdf: amendedPetitionFormData,
  });

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    pdfData: Buffer.from(combinedPdf),
    pdfName: docketEntryId,
  });
};
