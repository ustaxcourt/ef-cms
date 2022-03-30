const {
  combineTwoPdfs,
} = require('../utilities/documentGenerators/combineTwoPdfs');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');

/**
 *
 * Add docket entry for system generated order
 * generates the order and uploads to s3
 * saves documentContents and richText for editing the order
 *
 * //fix doc
 *
 * @param {object} providers the providers object
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
    // const { PDFDocument } = await applicationContext.getPdfLib();
    // const amendedPetitionPdf = Buffer.from(
    //   '../../../static/pdfs/amended-petition-form.pdf',
    // );
    // console.log('got it!!', amendedPetitionPdf);
    // const pdfjsLib = await applicationContext.getPdfJs();
    // const thing1 = await pdfjsLib.getDocument(
    //   '../../../static/pdfs/amended-petition-form.pdf',
    // ).promise;
    // console.log('got it!2222!', thing1);
    // const amendedPetitionFormData = await PDFDocument.load(amendedPetitionPdf);
    // // const amendedPetitionFormData = await PDFDocument.load(thing1);
    // // console.log('got it!33333!', amendedPetitionFormData);
    // orderPdfData = await combineTwoPdfs({
    //   applicationContext,
    //   firstPdf: new Uint8Array(orderPdfData),
    //   secondPdf: amendedPetitionFormData,
    // });
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
