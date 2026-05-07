import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { saveFileAndGenerateUrl } from './saveFileAndGenerateUrl';
import { getDocumentStorageId } from '@shared/business/utilities/getDocumentStorageId';
import {
  inTransaction,
  onTransactionCommit,
} from '@web-api/persistence/postgres/utils/transactions';

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

  const newPdfDoc = await PDFDocument.create();

  for (const caseEntity of caseEntities) {
    const servedParties = aggregatePartiesForService(caseEntity);
    if (electronicParties) servedParties.electronic = electronicParties;

    const sendEmails = async () => {
      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId,
        servedParties,
      });
    };
    
    if (inTransaction()) {
      onTransactionCommit(sendEmails);
    } else {
      await sendEmails();
    }

    if (servedParties.paper.length > 0) {
      if (!originalPdfDoc) {
        if (stampedPdf) {
          originalPdfDoc = await PDFDocument.load(stampedPdf);
        } else {
          const documentStorageId = getDocumentStorageId({
            caseDetail: caseEntity,
            docketEntryId,
          });

          const pdfData = await applicationContext
            .getPersistenceGateway()
            .getDocument({
              applicationContext,
              key: documentStorageId,
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
