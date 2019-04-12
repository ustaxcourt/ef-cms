const {
  PDFDocumentFactory,
  PDFDocumentWriter,
  drawLinesOfText,
  StandardFonts
} = require('pdf-lib');

/**
 * addCoverToPDFDocument
 *
 * @param pdfData // Uint8Array
 * @param coverSheetData
 */

exports.addCoverToPDFDocument = ({ pdfData, coverSheetData }) => {
  // Dimensions of cover page - 8.5"x11" @ 300dpi
  const coverPageDimensions = [2550, 3300];

  const contents = Object.keys(coverSheetData).map(key => {
    const coverSheetDatumValue = coverSheetData[key];
    switch (key) {
      case 'includesCertificateOfService':
        if (coverSheetDatumValue === true) {
          return 'CERTIFICATE OF SERVICE';
        } else {
          return '';
        }
      case 'originallyFiledElectronically':
        if (coverSheetDatumValue === true) {
          return 'ELECTRONICALLY FILED';
        } else {
          return '';
        }
      default:
        return coverSheetDatumValue.toString();
    }
  });

  // create pdfDoc object from file data
  const pdfDoc = PDFDocumentFactory.load(pdfData);

  // Embed font to use for cover page generation
  const [timesRomanFont] = pdfDoc.embedStandardFont('Times-Roman');

  // Generate cover page
  const coverPage = pdfDoc
    .createPage(coverPageDimensions)
    .addFontDictionary('Times-Roman', timesRomanFont);

  // This is where the magic happens. The content stream and its coords will need to be
  // played with in order to get the desired cover page layout.
  const coverPageContentStream = pdfDoc.createContentStream(
    drawLinesOfText(contents, {
      colorRgb: [0, 0, 0],
      font: 'Times-Roman',
      size: 38,
      x: 20,
      y: 20,
    }),
  );

  // Add the content stream to our newly created page
  coverPage.addContentStreams(pdfDoc.register(coverPageContentStream));

  // Insert cover page at position 0 (first) in the document. This is non-destructive, and
  // pushes the original first page to page two.
  pdfDoc.insertPage(0, coverPage);

  // Write our pdfDoc object to byte array, ready to physically write to disk or upload
  // to file server
  const newPdfData = PDFDocumentWriter.saveToBytes(pdfDoc);

  return newPdfData;
};
