const {
  AMENDED_PETITION_FORM_NAME,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../entities/EntityConstants');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');
/**
 *
 * Add docket entry for draft stamp order
 * generates the order and uploads to s3
 * saves documentContents and richText for editing the order
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Case} providers.caseEntity the caseEntity
 * @param {string} providers.systemGeneratedDocument the systemGeneratedDocument
 */
exports.addDocketEntryForDraftStampOrder = async ({
  applicationContext,
  caseEntity,
  systemGeneratedDocument: draftStampOrder,
}) => {
  const user = applicationContext.getCurrentUser();

  const newDocketEntry = new DocketEntry(
    {
      documentTitle: draftStampOrder.documentTitle,
      documentType: draftStampOrder.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: draftStampOrder.documentTitle,
        documentType: draftStampOrder.documentType,
        eventCode: draftStampOrder.eventCode,
      },
      eventCode: draftStampOrder.eventCode,
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
      orderContent: draftStampOrder.content,
      orderTitle: draftStampOrder.documentTitle.toUpperCase(),
      signatureText: isNotice
        ? applicationContext.getClerkOfCourtNameForSigning()
        : '',
    },
  });

  let combinedPdf = orderPdfData;
  if (
    draftStampOrder.eventCode ===
      SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetition.eventCode ||
    draftStampOrder.eventCode ===
      SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetitionAndFilingFee
        .eventCode
  ) {
    const { Body: amendedPetitionFormData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: AMENDED_PETITION_FORM_NAME,
      })
      .promise();

    const returnVal = await applicationContext.getUtilities().combineTwoPdfs({
      applicationContext,
      firstPdf: combinedPdf,
      secondPdf: amendedPetitionFormData,
    });
    combinedPdf = Buffer.from(returnVal);
  }

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    pdfData: combinedPdf,
    pdfName: newDocketEntry.docketEntryId,
  });

  const documentContentsId = applicationContext.getUniqueId();

  const contentToStore = {
    documentContents: draftStampOrder.content,
    richText: draftStampOrder.content,
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
