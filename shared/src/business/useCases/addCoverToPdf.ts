import { Case } from '../entities/cases/Case';
import { DocketEntry } from '../entities/DocketEntry';
import { generateCoverSheetData } from './generateCoverSheetData';

/**
 * a helper function which creates a coversheet, prepends it to a pdf, and returns the new pdf
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.docketEntryEntity the docket entry entity we are creating the cover for
 * @param {object} options.pdfData the original document pdf data
 * @returns {object} the new pdf with a coversheet attached
 */
export const addCoverToPdf = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  filingDateUpdated,
  pdfData,
  replaceCoversheet = false,
  useInitialData = false,
}: {
  applicationContext: IApplicationContext;
  caseEntity: Case;
  docketEntryEntity: DocketEntry;
  pdfData: any;
  filingDateUpdated?: any;
  replaceCoversheet?: boolean;
  useInitialData?: boolean;
}) => {
  const coverSheetData = await generateCoverSheetData({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated,
    useInitialData,
  });

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData);

  // allow GC to clear original loaded pdf data
  pdfData = null;

  const coverPagePdf = await applicationContext
    .getDocumentGenerators()
    .coverSheet({
      applicationContext,
      data: coverSheetData,
    });

  const coverPageDocument = await PDFDocument.load(coverPagePdf);
  const coverPageDocumentPages = await pdfDoc.copyPages(
    coverPageDocument,
    coverPageDocument.getPageIndices(),
  );

  if (replaceCoversheet) {
    pdfDoc.removePage(0);
    pdfDoc.insertPage(0, coverPageDocumentPages[0]);
  } else {
    pdfDoc.insertPage(0, coverPageDocumentPages[0]);
  }

  const newPdfData = await pdfDoc.save();
  const numberOfPages = pdfDoc.getPageCount();

  return {
    consolidatedCases: coverSheetData.consolidatedCases,
    numberOfPages,
    pdfData: newPdfData,
  };
};
