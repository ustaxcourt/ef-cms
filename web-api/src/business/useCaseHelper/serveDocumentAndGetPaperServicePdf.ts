import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { saveFileAndGenerateUrl } from './saveFileAndGenerateUrl';
import { processCaseForService } from './service/processCaseForService';

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

  const newPdfDoc = await PDFDocument.create();

  if (caseSpecificDocketEntries && caseSpecificDocketEntries.length > 0) {
    for (const {
      caseEntity,
      docketEntryId: caseSpecificDocketEntryId,
    } of caseSpecificDocketEntries) {
      await processCaseForService({
        PDFDocument,
        applicationContext,
        caseEntity,
        docketEntryId: caseSpecificDocketEntryId,
        electronicParties,
        loadPdfDocument: async () =>
          applicationContext.getPersistenceGateway().getDocument({
            applicationContext,
            key: caseSpecificDocketEntryId,
          }),
        newPdfDoc,
      });
    }
  } else {
    let cachedPdfData: any = null;

    for (const caseEntity of caseEntities) {
      await processCaseForService({
        PDFDocument,
        applicationContext,
        caseEntity,
        docketEntryId,
        electronicParties,
        loadPdfDocument: async () => {
          if (!cachedPdfData) {
            if (stampedPdf) {
              cachedPdfData = stampedPdf;
            } else {
              cachedPdfData = await applicationContext
                .getPersistenceGateway()
                .getDocument({
                  applicationContext,
                  key: docketEntryId,
                });
            }
          }
          return cachedPdfData;
        },
        newPdfDoc,
      });
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
