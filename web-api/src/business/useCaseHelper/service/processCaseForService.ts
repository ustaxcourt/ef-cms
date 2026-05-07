import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { PDFDocument } from 'pdf-lib';
import {
  inTransaction,
  onTransactionCommit,
} from '@web-api/persistence/postgres/utils/transactions';

export const processCaseForService = async ({
  applicationContext,
  caseEntity,
  docketEntryId,
  electronicParties,
  loadPdfDocument,
  newPdfDoc,
  PDFDocument,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  docketEntryId: string;
  electronicParties?: { email: string; name: string }[];
  loadPdfDocument: () => Promise<Uint8Array>;
  newPdfDoc: PDFDocument;
  PDFDocument: any;
}) => {
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
    const pdfData = await loadPdfDocument();
    const noticeDoc = await PDFDocument.load(pdfData);

    await applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf({
        applicationContext,
        caseEntity,
        newPdfDoc,
        noticeDoc,
        servedParties,
      });
  }
};
