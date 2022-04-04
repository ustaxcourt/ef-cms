const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');

/**
 *
 * Add docket entry for system generated order
 * generates the order and uploads to s3
 * saves documentContents and richText for editing the order
 *
 *
 * @param {object} providers the providers object
 * @param {object} providers.additionalPdfRequired flag to indicate if a form is to be appended to the document
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseEntity the caseEntity
 * @param {string} providers.systemGeneratedDocument the systemGeneratedDocument
 */
exports.addDocketEntryForSystemGeneratedOrder = async ({
  additionalPdfRequired = false,
  applicationContext,
  caseEntity,
  systemGeneratedDocument,
}) => {
  const user = applicationContext.getCurrentUser();
  const isNotice = systemGeneratedDocument.eventCode === 'NOT';

  const newDocketEntry = new DocketEntry(
    {
      documentTitle: systemGeneratedDocument.documentTitle,
      documentType: systemGeneratedDocument.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: systemGeneratedDocument.documentTitle,
        documentType: systemGeneratedDocument.documentType,
        eventCode: systemGeneratedDocument.eventCode,
        ...(isNotice && { freeText: systemGeneratedDocument.documentTitle }),
      },
      eventCode: systemGeneratedDocument.eventCode,
      ...(isNotice && { freeText: systemGeneratedDocument.documentTitle }),
      isDraft: true,
      userId: user.userId,
    },
    { applicationContext },
  );

  caseEntity.addDocketEntry(newDocketEntry);
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);
  const { docketNumberWithSuffix } = caseEntity;

  let orderPdfData = await applicationContext.getDocumentGenerators().order({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix,
      orderContent: systemGeneratedDocument.content,
      orderTitle: systemGeneratedDocument.documentTitle.toUpperCase(),
      signatureText: isNotice
        ? applicationContext.getClerkOfCourtNameForSigning()
        : '',
    },
  });

  if (additionalPdfRequired) {
    orderPdfData = await applicationContext
      .getUtilities()
      .appendAmendedPetitionFormToOrder({
        applicationContext,
        orderPdfData,
      });
  }

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    caseConfirmationPdfName: newDocketEntry.docketEntryId,
    pdfData: orderPdfData,
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
