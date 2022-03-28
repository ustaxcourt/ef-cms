const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');

/**
 *
 * Add docket entry for system generated order
 * generates the order and uploads to s3
 * saves documentContents and richText for editing the order
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseEntity the caseEntity
 * @param {string} providers.systemGeneratedDocument the systemGeneratedDocument
 */
exports.addDocketEntryForSystemGeneratedOrder = async ({
  applicationContext,
  caseEntity,
  systemGeneratedDocument,
}) => {
  const user = applicationContext.getCurrentUser();

  const newDocketEntry = new DocketEntry(
    {
      documentTitle: systemGeneratedDocument.documentTitle,
      documentType: systemGeneratedDocument.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: systemGeneratedDocument.documentTitle,
        documentType: systemGeneratedDocument.documentType,
        eventCode: systemGeneratedDocument.eventCode,
        freeText: systemGeneratedDocument.documentTitle,
      },
      eventCode: systemGeneratedDocument.eventCode,
      freeText: systemGeneratedDocument.documentTitle,
      isDraft: true,
      userId: user.userId,
    },
    { applicationContext },
  );

  caseEntity.addDocketEntry(newDocketEntry);
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);
  const { docketNumberWithSuffix } = caseEntity;

  const pdfData = await applicationContext.getDocumentGenerators().order({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix,
      orderContent: systemGeneratedDocument.content,
      orderTitle: systemGeneratedDocument.documentTitle.toUpperCase(),
      signatureText:
        systemGeneratedDocument.eventCode === 'NOT'
          ? applicationContext.getClerkOfCourtNameForSigning()
          : '',
    },
  });

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    caseConfirmationPdfName: newDocketEntry.docketEntryId,
    pdfData,
  });

  const documentContentsId = applicationContext.getUniqueId();

  const contentToStore = {
    documentContents: systemGeneratedDocument.content,
    richText: systemGeneratedDocument.content,
  };

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    contentType: 'application/json',
    document: Buffer.from(JSON.stringify(contentToStore)),
    key: documentContentsId,
    useTempBucket: false,
  });

  newDocketEntry.documentContentsId = documentContentsId;
};
