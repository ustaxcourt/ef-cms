import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { saveFileAndGenerateUrl } from './saveFileAndGenerateUrl';

export const serveDocumentAndGetPaperServicePdf = async ({
  applicationContext,
  caseEntities,
  docketEntryId,
  caseSpecificDocketEntries,
  electronicParties,
  stampedPdf,
}: {
  applicationContext: ServerApplicationContext;
  caseEntities: Case[];
  docketEntryId: string;
  caseSpecificDocketEntries?: Array<{
    caseEntity: Case;
    docketEntryId: string;
  }>; 
  stampedPdf?: any;
  electronicParties?: { email: string; name: string }[];
}): Promise<{ pdfUrl: string } | undefined> => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  let originalPdfDoc;

  const newPdfDoc = await PDFDocument.create();

  if (caseSpecificDocketEntries && caseSpecificDocketEntries.length > 0) {
    for (const {
      caseEntity,
      docketEntryId: caseSpecificDocketEntryId,
    } of caseSpecificDocketEntries) {
      const servedParties = aggregatePartiesForService(caseEntity);
      if (electronicParties) servedParties.electronic = electronicParties;

      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId: caseSpecificDocketEntryId,
        servedParties,
      });

      if (servedParties.paper.length > 0) {
        const pdfData = await applicationContext
          .getPersistenceGateway()
          .getDocument({
            applicationContext,
            key: caseSpecificDocketEntryId,
          });
        const caseSpecificNoticeDoc = await PDFDocument.load(pdfData);

        await applicationContext
          .getUseCaseHelpers()
          .appendPaperServiceAddressPageToPdf({
            applicationContext,
            caseEntity,
            newPdfDoc,
            noticeDoc: caseSpecificNoticeDoc,
            servedParties,
          });
      }
    }
  } else {
    for (const caseEntity of caseEntities) {
      const servedParties = aggregatePartiesForService(caseEntity);
      if (electronicParties) servedParties.electronic = electronicParties;

      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId,
        servedParties,
      });

      if (servedParties.paper.length > 0) {
        if (!originalPdfDoc) {
          if (stampedPdf) {
            originalPdfDoc = await PDFDocument.load(stampedPdf);
          } else {
            const pdfData = await applicationContext
              .getPersistenceGateway()
              .getDocument({
                applicationContext,
                key: docketEntryId,
              });
            originalPdfDoc = await PDFDocument.load(pdfData);
          }
        }
        await applicationContext
          .getUseCaseHelpers()
          .appendPaperServiceAddressPageToPdf({
            applicationContext,
            caseEntity,
            newPdfDoc,
            noticeDoc: originalPdfDoc,
            servedParties,
          });
      }
    }
  }

  if (newPdfDoc.getPageCount() > 0) {
    const paperServicePdfData = await newPdfDoc.save();
    const { url } = await saveFileAndGenerateUrl({
      applicationContext,
      file: paperServicePdfData.buffer,
      useTempBucket: true,
    });

    return { pdfUrl: url };
  }
};
