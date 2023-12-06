import {
  AMENDED_PETITION_FORM_NAME,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../entities/EntityConstants';
import { DocketEntry } from '../entities/DocketEntry';
import { getCaseCaptionMeta } from '../utilities/getCaseCaptionMeta';

/**
 *
 * Add docket entry for system generated order
 * generates the order and uploads to s3
 * saves documentContents and richText for editing the order
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Case} providers.caseEntity the caseEntity
 * @param {string} providers.systemGeneratedDocument the systemGeneratedDocument
 */
export const addDocketEntryForSystemGeneratedOrder = async ({
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
    },
    { applicationContext },
  );

  newDocketEntry.setFiledBy(user);

  caseEntity.addDocketEntry(newDocketEntry);
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);
  const { docketNumberWithSuffix } = caseEntity;

  let nameOfClerk = '';
  let titleOfClerk = '';
  if (isNotice) {
    const { name, title } = await applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue({
        applicationContext,
        configurationItemKey:
          applicationContext.getConstants().CLERK_OF_THE_COURT_CONFIGURATION,
      });
    nameOfClerk = name;
    titleOfClerk = title;
  }

  let orderPdfData = await applicationContext.getDocumentGenerators().order({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix,
      nameOfClerk,
      orderContent: systemGeneratedDocument.content,
      orderTitle: systemGeneratedDocument.documentTitle.toUpperCase(),
      titleOfClerk,
    },
  });

  let combinedPdf = orderPdfData;
  if (
    systemGeneratedDocument.eventCode ===
      SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetition.eventCode ||
    systemGeneratedDocument.eventCode ===
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
