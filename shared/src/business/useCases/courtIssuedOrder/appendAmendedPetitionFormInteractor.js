const {
  AMENDED_PETITION_FORM_NAME,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * appendAmendedPetitionFormInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docketEntryId of the document
 * @returns {Object} the combined pdf
 */
exports.appendAmendedPetitionFormInteractor = async (
  applicationContext,
  { docketEntryId },
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
        protocol: 'S3',
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
    caseConfirmationPdfName: docketEntryId,
    pdfData: Buffer.from(combinedPdf),
  });
};
