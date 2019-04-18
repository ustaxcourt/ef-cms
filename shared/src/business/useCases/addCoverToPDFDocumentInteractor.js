const {
  PDFDocumentFactory,
  PDFDocumentWriter,
  drawText,
  drawLinesOfText,
  drawRectangle,
} = require('pdf-lib');

/**
 * addCoverToPDFDocument
 *
 * @param pdfData // Uint8Array
 * @param coverSheetData
 */

exports.addCoverToPDFDocument = ({ pdfData, coverSheetData }) => {
  // Dimensions of cover page - 8.5"x11" @ 300dpi
  const dimensionsX = 2550;
  const dimensionsY = 3300;
  const coverPageDimensions = [dimensionsX, dimensionsY];
  const horizontalMargin = 425; // left and right margins
  const verticalMargin = 400; // top and bottom margins
  const fontSize = 20;

  // create pdfDoc object from file data
  const pdfDoc = PDFDocumentFactory.load(pdfData);

  // Embed font to use for cover page generation
  const [timesRomanRef, timesRomanFont] = pdfDoc.embedStandardFont(
    'Times-Roman',
  );

  // Generate cover page
  const coverPage = pdfDoc
    .createPage(coverPageDimensions)
    .addFontDictionary('Times-Roman', timesRomanRef);

  function getContentByKey(key) {
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
  }
  // Point of origin is bottom left, this flips the y-axis
  // coord to a traditional top left value
  function translateY(yPos, screenToPrintDpi) {
    const newY = dimensionsY - yPos;
    if (screenToPrintDpi) {
      return (300 / 72) * newY;
    } else {
      return newY;
    }
  }

  // returns content block
  function contentBlock(content, coords) {
    return {
      content,
      xPos: coords[0],
      yPos: coords[1],
    };
  }

  function getYOffsetFromPreviousContentArea(
    previousContentArea,
    font,
    fontSize,
    offsetMargin = 0,
  ) {
    let totalContentHeight;
    const textHeight = font.heightOfFontAtSize(fontSize);
    if (Array.isArray(previousContentArea.content)) {
      // Multiple lines of text
      totalContentHeight = previousContentArea.content.length * textHeight;
    } else {
      // Single line of text
      totalContentHeight = textHeight;
    }
    // we subtract here because coords start at bottom left;
    return Math.round(
      previousContentArea.yPos - totalContentHeight - offsetMargin,
    );
  }

  // Measures text width against given widthConstraint to
  // break into multiple lines (expressed as an array)
  function wrapText(text, widthConstraint, font, fontSize) {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    if (textWidth <= widthConstraint) {
      return text;
    } else {
      // break the text up and test its width
      const textArry = text.split(' ');

      // This doesn't feel super effecient, so maybe come back to this
      const textLines = textArry.reduce(function(acc, cur) {
        const lastIndex = acc.length - 1;
        const proposedLine = `${acc[lastIndex]} ${cur}`;
        const proposedLineWidth = font.widthOfTextAtSize(
          proposedLine,
          fontSize,
        );

        if (proposedLineWidth <= widthConstraint) {
          acc[lastIndex] = proposedLine;
        } else {
          acc.push(cur);
        }
        return acc;
      }, []);
      return textLines;
    }
  }

  // Content areas
  const contentStamp = contentBlock('[ STAMP ]', [
    horizontalMargin,
    translateY(verticalMargin),
  ]);
  const contentDateReceived = contentBlock(
    ['Received', getContentByKey('dateReceived')],
    [510, 3036],
  );
  const contentDateLodged = contentBlock(
    ['Lodged', getContentByKey('dateLodged')],
    [1369, 3036],
  );
  const contentDateFiled = contentBlock(
    ['Filed', getContentByKey('dateFiled')],
    [2033, 3036],
  );
  const contentCaseCaptionPet = contentBlock(
    wrapText(
      getContentByKey('caseCaptionPetitioner'),
      1042,
      timesRomanFont,
      fontSize,
    ),
    [horizontalMargin, 2534],
  );
  const contentPetitionerLabel = contentBlock('Petitioner', [
    531,
    getYOffsetFromPreviousContentArea(
      contentCaseCaptionPet,
      timesRomanFont,
      fontSize,
      timesRomanFont.heightOfFontAtSize(fontSize),
    ),
  ]);
  const contentVLabel = contentBlock('V.', [
    531,
    getYOffsetFromPreviousContentArea(
      contentPetitionerLabel,
      timesRomanFont,
      fontSize,
      timesRomanFont.heightOfFontAtSize(fontSize),
    ),
  ]);
  const contentCaseCaptionResp = contentBlock(
    wrapText(
      getContentByKey('caseCaptionRespondent'),
      1042,
      timesRomanFont,
      fontSize,
    ),
    [horizontalMargin, 2534],
  );
  const contentRespondentLabel = contentBlock('Respondent', [
    531,
    getYOffsetFromPreviousContentArea(
      contentCaseCaptionResp,
      timesRomanFont,
      fontSize,
      timesRomanFont.heightOfFontAtSize(fontSize),
    ),
  ]);
  const contentElectronicallyFiled = contentBlock(
    getContentByKey('originallyFiledElectronically'),
    [1530, contentPetitionerLabel.yPos],
  );
  const contentDocketNumber = contentBlock(getContentByKey('docketNumber'), [
    1530,
    contentVLabel.yPos,
  ]);
  const contentDocumentTitle = contentBlock(
    wrapText(getContentByKey('documentTitle'), 1683, timesRomanFont, fontSize),
    [
      2117,
      getYOffsetFromPreviousContentArea(
        contentRespondentLabel,
        timesRomanFont,
        fontSize,
        timesRomanFont.heightOfFontAtSize(fontSize) * 5,
      ),
    ],
  );
  const contentCertificateOfService = contentBlock(
    getContentByKey('includesCertificateOfService'),
    [
      horizontalMargin,
      getYOffsetFromPreviousContentArea(
        contentDocumentTitle,
        timesRomanFont,
        fontSize,
        timesRomanFont.heightOfFontAtSize(fontSize) * 5,
      ),
    ],
  );

  function drawContent(contentArea) {
    const { content, xPos, yPos } = contentArea;
    const params = {
      colorRgb: [0, 0, 0],
      font: 'Times-Roman',
      size: fontSize,
      x: xPos,
      y: yPos,
    };

    if (Array.isArray(content)) {
      return drawLinesOfText(content, params);
    } else {
      return drawText(content, params);
    }
  }

  // This is where the magic happens. The content stream and its coords will need to be
  // played with in order to get the desired cover page layout.
  const coverPageContentStream = pdfDoc.createContentStream(
    // Header Content
    ...[
      contentStamp,
      contentDateReceived,
      contentDateLodged,
      contentDateFiled,
    ].map(cont => drawContent(cont)),
    // HR in header
    drawRectangle({
      borderColorRgb: [0.3, 0.3, 0.3],
      borderWidth: 0,
      height: 2,
      width: dimensionsX,
      x: 0,
      y: 2824,
    }),
    // Body Content
    ...[
      contentCaseCaptionPet,
      contentPetitionerLabel,
      contentVLabel,
      contentCaseCaptionResp,
      contentRespondentLabel,
      contentElectronicallyFiled,
      contentDocketNumber,
      contentDocumentTitle,
      contentCertificateOfService,
    ].map(cont => drawContent(cont)),
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
