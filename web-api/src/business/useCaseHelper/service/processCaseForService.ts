import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';

/**
 * Helper function to process a single case for service
 * @param {object} params the parameters object
 * @param {ServerApplicationContext} params.applicationContext the application context
 * @param {Case} params.caseEntity the case entity
 * @param {string} params.docketEntryId the docket entry id
 * @param {object} params.electronicParties optional electronic parties to add
 * @param {Function} params.loadPdfDocument function to load the PDF document
 * @param {object} params.newPdfDoc the new PDF document for paper service
 * @param {object} params.PDFDocument the PDFDocument class
 * @returns {Promise<void>}
 */
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
  loadPdfDocument: () => Promise<any>;
  newPdfDoc: any;
  PDFDocument: any;
}) => {
  const servedParties = aggregatePartiesForService(caseEntity);
  if (electronicParties) servedParties.electronic = electronicParties;

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId,
    servedParties,
  });

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
