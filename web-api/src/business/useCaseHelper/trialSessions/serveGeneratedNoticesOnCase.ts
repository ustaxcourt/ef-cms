import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { PDFDocument } from 'pdf-lib';

type ServeGeneratedNoticesOnCaseParams = {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  newPdfDoc: PDFDocument;
  noticeDocketEntryEntity: DocketEntry;
  noticeDocumentPdfData: Uint8Array<ArrayBufferLike>;
  servedParties: {
    all: any[];
    paper: any[];
    electronic: Array<{ email: string; name: string }>;
  };
  skipEmailToIrs?: boolean;
};

export const serveGeneratedNoticesOnCase = async ({
  applicationContext,
  caseEntity,
  newPdfDoc,
  noticeDocketEntryEntity,
  noticeDocumentPdfData,
  servedParties,
  skipEmailToIrs = false,
}: ServeGeneratedNoticesOnCaseParams) => {
  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: noticeDocketEntryEntity.docketEntryId,
    servedParties,
    skipEmailToIrs,
  });

  if (servedParties.paper.length > 0) {
    const { PDFDocument } = await applicationContext.getPdfLib();
    const noticeDocumentPdf = await PDFDocument.load(noticeDocumentPdfData);

    await applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf({
        applicationContext,
        caseEntity,
        newPdfDoc,
        noticeDoc: noticeDocumentPdf,
        servedParties,
      });
  }
};
