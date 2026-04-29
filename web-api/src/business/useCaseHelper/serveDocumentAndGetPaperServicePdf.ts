import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { saveFileAndGenerateUrl } from './saveFileAndGenerateUrl';
import { processCaseForService } from './service/processCaseForService';
import { getDocumentStorageId } from '@shared/business/utilities/getDocumentStorageId';

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
  stampedPdf?: Uint8Array;
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
        loadPdfDocument: async () => {
          const documentStorageId = getDocumentStorageId({
            caseDetail: caseEntity,
            docketEntryId: caseSpecificDocketEntryId,
          });
          return await applicationContext.getPersistenceGateway().getDocument({
            applicationContext,
            key: documentStorageId,
          });
        },
        newPdfDoc,
      });
    }
  } else {
    let cachedPdfData: any = null;
    let cachedDocumentStorageId: string | undefined = undefined;

    for (const caseEntity of caseEntities) {
      await processCaseForService({
        PDFDocument,
        applicationContext,
        caseEntity,
        docketEntryId,
        electronicParties,
        loadPdfDocument: async () => {
          if (stampedPdf) {
            return stampedPdf;
          }

          const documentStorageId = getDocumentStorageId({
            caseDetail: caseEntity,
            docketEntryId,
          });

          if (!cachedDocumentStorageId) {
            cachedDocumentStorageId = documentStorageId;
            cachedPdfData = await applicationContext
              .getPersistenceGateway()
              .getDocument({
                applicationContext,
                key: documentStorageId,
              });
          }

          if (cachedDocumentStorageId !== documentStorageId) {
            cachedPdfData = await applicationContext
              .getPersistenceGateway()
              .getDocument({
                applicationContext,
                key: documentStorageId,
              });
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