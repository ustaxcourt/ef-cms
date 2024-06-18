import {
  AMENDED_PETITION_FORM_NAME,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseCaptionMeta } from '../../../../shared/src/business/utilities/getCaseCaptionMeta';

export const addDocketEntryForSystemGeneratedOrder = async ({
  applicationContext,
  caseEntity,
  systemGeneratedDocument,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  systemGeneratedDocument: any;
}): Promise<void> => {
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
      isFileAttached: true,
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
    const amendedPetitionFormData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: AMENDED_PETITION_FORM_NAME,
      });

    const returnVal = await applicationContext.getUtilities().combineTwoPdfs({
      applicationContext,
      firstPdf: combinedPdf,
      secondPdf: amendedPetitionFormData,
    });
    combinedPdf = Buffer.from(returnVal);
  }

  await applicationContext.getPersistenceGateway().uploadDocument({
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
