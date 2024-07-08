import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '../../../../shared/src/business/utilities/aggregatePartiesForService';
import { saveFileAndGenerateUrl } from './saveFileAndGenerateUrl';

export const serveDocumentAndGetPaperServicePdf = async ({
  applicationContext,
  caseEntities,
  docketEntryId,
  electronicParties,
  stampedPdf,
}: {
  applicationContext: ServerApplicationContext;
  caseEntities: Case[];
  docketEntryId: string;
  stampedPdf?: any;
  electronicParties?: { email: string; name: string }[];
}): Promise<{ pdfUrl: string } | undefined> => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  let originalPdfDoc;

  let newPdfDoc = await PDFDocument.create();

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

  if (newPdfDoc.getPageCount() > 0) {
    const paperServicePdfData = await newPdfDoc.save();
    const { url } = await saveFileAndGenerateUrl({
      applicationContext,
      file: paperServicePdfData,
      useTempBucket: true,
    });

    return { pdfUrl: url };
  }
};
