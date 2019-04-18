const fs = require('fs');
const path = require('path');
const {
  PDFDocumentFactory,
  PDFDocumentWriter,
  drawText,
  drawImage,
  drawLinesOfText,
  drawRectangle,
} = require('pdf-lib');

/**
 * addCoverToPDFDocument
 *
 * @param pdfData // Uint8Array
 * @param coverSheetData
 */
exports.addCoverToPDFDocument = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const coverSheetData = {
    caseCaptionPetitioner: 'John Doe',
    caseCaptionRespondent: 'Jane Doe',
    dateFiled: new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    dateLodged: new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    dateReceived: `${new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })} ${new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
    })}`,
    docketNumber: caseRecord.docketNumber,
    documentTitle:
      'Notice of Filing of Petition and Right to Intervene on Jonathan Buck',
    includesCertificateOfService: true,
    originallyFiledElectronically: true,
  };

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();

  // Dimensions of cover page - 8.5"x11" @ 300dpi
  const dimensionsX = 2550;
  const dimensionsY = 3300;
  const coverPageDimensions = [dimensionsX, dimensionsY];
  const horizontalMargin = 215; // left and right margins
  const verticalMargin = 190; // top and bottom margins
  const defaultFontSize = 40;
  const fontSizeCaption = 50;
  const fontSizeTitle = 60;

  // create pdfDoc object from file data
  const pdfDoc = PDFDocumentFactory.load(pdfData);

  // USTC Seal (png) to embed in header
  const staticImgPath = path.join(__dirname, '../../../static/images/');
  const ustcSealBytes = fs.readFileSync(staticImgPath + 'ustc_seal.png');
  const [pngSeal, pngSealDimensions] = pdfDoc.embedPNG(ustcSealBytes);

  // Embed font to use for cover page generation
  const [timesRomanRef, timesRomanFont] = pdfDoc.embedStandardFont(
    'Times-Roman',
  );

  // Generate cover page
  const coverPage = pdfDoc
    .createPage(coverPageDimensions)
    .addImageObject('USTCSeal', pngSeal)
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
  function contentBlock(content, coords, fontSize) {
    return {
      content,
      fontSize,
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
        const accLength = acc.length;
        const lastIndex = accLength > 0 ? acc.length - 1 : 0;
        const proposedLine = accLength > 0 ? `${acc[lastIndex]} ${cur}` : cur;
        const proposedLineWidth = font.widthOfTextAtSize(
          proposedLine,
          fontSize,
        );

        if (acc.length && proposedLineWidth <= widthConstraint) {
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
      fontSizeCaption,
    ),
    [horizontalMargin, 2534],
    fontSizeCaption,
  );
  const contentPetitionerLabel = contentBlock(
    'Petitioner',
    [
      531,
      getYOffsetFromPreviousContentArea(
        contentCaseCaptionPet,
        timesRomanFont,
        fontSizeCaption,
        timesRomanFont.heightOfFontAtSize(fontSizeCaption),
      ),
    ],
    fontSizeCaption,
  );
  const contentVLabel = contentBlock(
    'V.',
    [
      531,
      getYOffsetFromPreviousContentArea(
        contentPetitionerLabel,
        timesRomanFont,
        fontSizeCaption,
        timesRomanFont.heightOfFontAtSize(fontSizeCaption),
      ),
    ],
    fontSizeCaption,
  );
  const contentCaseCaptionResp = contentBlock(
    wrapText(
      getContentByKey('caseCaptionRespondent'),
      1042,
      timesRomanFont,
      fontSizeCaption,
    ),
    [
      horizontalMargin,
      getYOffsetFromPreviousContentArea(
        contentVLabel,
        timesRomanFont,
        fontSizeCaption,
        timesRomanFont.heightOfFontAtSize(fontSizeCaption),
      ),
    ],
    fontSizeCaption,
  );
  const contentRespondentLabel = contentBlock(
    'Respondent',
    [
      531,
      getYOffsetFromPreviousContentArea(
        contentCaseCaptionResp,
        timesRomanFont,
        fontSizeCaption,
        timesRomanFont.heightOfFontAtSize(fontSizeCaption),
      ),
    ],
    fontSizeCaption,
  );
  const contentElectronicallyFiled = contentBlock(
    getContentByKey('originallyFiledElectronically'),
    [1530, contentPetitionerLabel.yPos],
    fontSizeCaption,
  );
  const contentDocketNumber = contentBlock(
    `Docket Number: ${getContentByKey('docketNumber')}`,
    [1530, contentVLabel.yPos],
    fontSizeCaption,
  );
  const contentDocumentTitle = contentBlock(
    wrapText(
      getContentByKey('documentTitle'),
      1488,
      timesRomanFont,
      fontSizeTitle,
    ),
    [
      531,
      getYOffsetFromPreviousContentArea(
        contentRespondentLabel,
        timesRomanFont,
        fontSizeCaption,
        timesRomanFont.heightOfFontAtSize(fontSizeCaption) * 5,
      ),
    ],
    fontSizeTitle,
  );
  const contentCertificateOfService = contentBlock(
    getContentByKey('includesCertificateOfService'),
    [
      horizontalMargin,
      getYOffsetFromPreviousContentArea(
        contentDocumentTitle,
        timesRomanFont,
        fontSizeTitle,
        timesRomanFont.heightOfFontAtSize(fontSizeCaption) * 5,
      ),
    ],
  );

  function drawContent(contentArea) {
    const { content, xPos, yPos, fontSize } = contentArea;
    const params = {
      colorRgb: [0, 0, 0],
      font: 'Times-Roman',
      size: fontSize || defaultFontSize,
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
    drawImage('USTCSeal', {
      height: pngSealDimensions.height / 2,
      width: pngSealDimensions.width / 2,
      x: horizontalMargin,
      y: translateY(verticalMargin + pngSealDimensions.height / 2),
    }),
    ...[contentDateReceived, contentDateLodged, contentDateFiled].map(cont =>
      drawContent(cont),
    ),
    // HR in header
    drawRectangle({
      colorRgb: [0.3, 0.3, 0.3],
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

  await applicationContext
    .getPersistenceGateway()
    .saveDocument({ applicationContext, document: newPdfData, documentId });

  return newPdfData;
};
