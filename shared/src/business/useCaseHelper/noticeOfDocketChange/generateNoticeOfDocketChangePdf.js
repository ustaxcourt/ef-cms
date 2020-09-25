const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Generate Notice of Docket Change PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketChangeInfo contains information about what has changed
 * @returns {Promise<*>} the promise of the document having been uploaded
 */
exports.generateNoticeOfDocketChangePdf = async ({
  applicationContext,
  docketChangeInfo,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const {
    caseCaptionExtension,
    caseTitle,
    docketEntryIndex,
    docketNumber,
    filingParties,
    filingsAndProceedings,
  } = docketChangeInfo;

  const noticePdf = await applicationContext
    .getDocumentGenerators()
    .noticeOfDocketChange({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketEntryIndex,
        docketNumberWithSuffix: docketNumber,
        filingParties,
        filingsAndProceedings,
      },
    });

  const docketEntryId = applicationContext.getUniqueId();

  await new Promise(resolve => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: noticePdf,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: docketEntryId,
    };

    s3Client.upload(params, resolve);
  });

  return docketEntryId;
};
