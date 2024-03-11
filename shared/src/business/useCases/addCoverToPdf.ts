import { Case } from '../entities/cases/Case';
import { DocketEntry } from '../entities/DocketEntry';
import { generateCoverSheetData } from './generateCoverSheetData';

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
