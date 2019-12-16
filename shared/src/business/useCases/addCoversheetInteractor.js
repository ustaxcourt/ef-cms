const { Case } = require('../entities/cases/Case');
const { coverLogo } = require('../assets/coverLogo');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * a helper function which creates a coversheet, prepends it to a pdf, and returns the new pdf
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.documentEntity the document entity we are creating the cover for
 * @param {object} options.pdfData the original document pdf data
 * @returns {object} the new pdf with a coversheet attached
 */
exports.addCoverToPdf = async ({
  applicationContext,
  caseEntity,
  documentEntity,
  pdfData,
}) => {
  const isLodged = documentEntity.lodged;
  const { isPaper } = documentEntity;

  const dateServedFormatted =
    (documentEntity.servedAt &&
      'Served ' +
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.servedAt, 'MMDDYYYY')) ||
    '';

  let dateReceivedFormatted;

  if (isPaper) {
    dateReceivedFormatted =
      (documentEntity.createdAt &&
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.createdAt, 'MMDDYYYY')) ||
      null;
  } else {
    dateReceivedFormatted =
      (documentEntity.createdAt &&
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.createdAt, 'MM/DD/YYYY hh:mm a')) ||
      null;
  }

  const dateFiledFormatted =
    (documentEntity.createdAt &&
      applicationContext
        .getUtilities()
        .formatDateString(documentEntity.createdAt, 'MMDDYYYY')) ||
    null;

  const caseCaption = caseEntity.caseCaption || Case.getCaseCaption(caseEntity);
  const caseCaptionNames = Case.getCaseCaptionNames(caseCaption);

  let documentTitle =
    documentEntity.documentTitle || documentEntity.documentType;
  if (documentEntity.additionalInfo && documentEntity.addToCoversheet) {
    documentTitle += ` ${documentEntity.additionalInfo}`;
  }

  const coverSheetData = {
    caseCaptionPetitioner: caseCaptionNames,
    caseCaptionRespondent: 'Commissioner of Internal Revenue',
    dateFiled: isLodged ? '' : dateFiledFormatted,
    dateLodged: isLodged ? dateFiledFormatted : '',
    dateReceived: dateReceivedFormatted,
    dateServed: dateServedFormatted,
    docketNumber:
      caseEntity.docketNumber + (caseEntity.docketNumberSuffix || ''),
    documentTitle,
    includesCertificateOfService:
      documentEntity.certificateOfService === true ? true : false,
    mailingDate: documentEntity.mailingDate || '',
    originallyFiledElectronically: !documentEntity.isPaper,
  };

  // create pdfDoc object from file data
  applicationContext.logger.time('Loading the PDF');
  const pdfDoc = await PDFDocument.load(pdfData);
  applicationContext.logger.time('Loading the PDF');

  // Embed font to use for cover page generation
  applicationContext.logger.time('Embed Font');
  const helveticaFont = pdfDoc.embedStandardFont(StandardFonts.Helvetica);
  const helveticaBoldFont = pdfDoc.embedStandardFont(
    StandardFonts.HelveticaBold,
  );
  applicationContext.logger.timeEnd('Embed Font');

  // Dimensions of cover page - 8.5"x11" @ 300dpi
  const dimensionsX = 2550;
  const dimensionsY = 3300;
  const minimumAcceptableWidth = 600;
  const coverPageDimensions = [dimensionsX, dimensionsY];
  const horizontalMargin = 215; // left and right margins
  const verticalMargin = 190; // top and bottom margins
  const defaultFontName = helveticaFont;
  const defaultFontSize = 48;
  const fontSizeCaption = 64;
  const fontSizeTitle = 80;

  // allow GC to clear original loaded pdf data
  pdfData = null;

  const getPageDimensions = page => {
    return page.getSize();
  };

  const pageScaler = value => {
    return Math.round(value * (scaleToPageWidth / dimensionsX));
  };

  const pages = pdfDoc.getPages();
  const originalPageDimensions = getPageDimensions(pages[0]);
  const originalPageWidth = originalPageDimensions.width;

  const scaleToPageWidth =
    originalPageWidth >= minimumAcceptableWidth
      ? originalPageWidth
      : minimumAcceptableWidth;

  // USTC Seal (png) to embed in header
  applicationContext.logger.time('Embed PNG');
  const ustcSealBytes = new Uint8Array(coverLogo);
  const pngSeal = await pdfDoc.embedPng(ustcSealBytes);
  applicationContext.logger.timeEnd('Embed PNG');

  // Generate cover page
  applicationContext.logger.time('Generate Cover Page');
  const coverPage = pdfDoc.insertPage(
    0,
    coverPageDimensions.map(dim => pageScaler(dim)),
  );
  applicationContext.logger.timeEnd('Generate Cover Page');

  const paddedLineHeight = (fontSize = defaultFontSize) => {
    return fontSize * 0.25 + fontSize;
  };

  const getContentByKey = key => {
    const coverSheetDatumValue = coverSheetData[key];
    switch (key) {
      case 'includesCertificateOfService':
        if (coverSheetDatumValue) {
          return 'Certificate of Service';
        } else {
          return '';
        }
      case 'originallyFiledElectronically':
        if (coverSheetDatumValue) {
          return 'Electronically Filed';
        } else {
          return '';
        }
      default:
        return coverSheetDatumValue.toString();
    }
  };

  // Point of origin is bottom left, this flips the y-axis
  // coordinate to a traditional top left value
  const translateY = (yPos, screenToPrintDpi) => {
    const newY = dimensionsY - yPos;
    if (screenToPrintDpi) {
      return (300 / 72) * newY;
    } else {
      return newY;
    }
  };

  const getYOffsetFromPreviousContentArea = (
    previousContentArea,
    font,
    fontSize,
    offsetMargin = 0,
  ) => {
    let totalContentHeight;
    const textHeight = font.sizeAtHeight(fontSize);
    if (Array.isArray(previousContentArea.content)) {
      // Multiple lines of text
      totalContentHeight = previousContentArea.content.length * textHeight;
    } else {
      // Single line of text
      totalContentHeight = textHeight;
    }
    // we subtract here because coordinates start at bottom left;
    return Math.round(
      previousContentArea.yPos - totalContentHeight - offsetMargin,
    );
  };

  // Measures text width against given widthConstraint to
  // break into multiple lines (expressed as an array)
  const wrapText = (text, widthConstraint, font, fontSize) => {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    if (textWidth <= widthConstraint) {
      return text;
    } else {
      // break the text up and test its width
      const textArry = text.split(' ');

      // This doesn't feel super efficient, so maybe come back to this
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
  };

  const dateFiledLabel = isLodged ? '' : 'Filed';
  const dateLodgedLabel = isLodged ? 'Lodged' : '';

  // Content areas
  const contentDateReceivedLabel = {
    content: 'Received',
    fontName: helveticaBoldFont,
    xPos: isPaper ? 800 : 900,
    yPos: 3036,
  };

  const contentDateReceived = {
    content: getContentByKey('dateReceived'),
    xPos: 800,
    yPos: getYOffsetFromPreviousContentArea(
      contentDateReceivedLabel,
      helveticaBoldFont,
      defaultFontSize,
      helveticaFont.sizeAtHeight(defaultFontSize),
    ),
  };

  const contentDateLodgedLabel = {
    content: dateLodgedLabel,
    fontName: helveticaBoldFont,
    xPos: 1440,
    yPos: 3036,
  };

  const contentDateLodged = {
    content: getContentByKey('dateLodged'),
    xPos: 1415,
    yPos: getYOffsetFromPreviousContentArea(
      contentDateLodgedLabel,
      helveticaBoldFont,
      defaultFontSize,
      helveticaFont.sizeAtHeight(defaultFontSize),
    ),
  };

  const contentDateFiledLabel = {
    content: dateFiledLabel,
    fontName: helveticaBoldFont,
    xPos: 1938,
    yPos: 3036,
  };

  const contentDateFiled = {
    content: getContentByKey('dateFiled'),
    xPos: 1883,
    yPos: getYOffsetFromPreviousContentArea(
      contentDateFiledLabel,
      helveticaBoldFont,
      defaultFontSize,
      helveticaFont.sizeAtHeight(defaultFontSize),
    ),
  };

  const contentCaseCaptionPet = {
    content: wrapText(
      getContentByKey('caseCaptionPetitioner'),
      1042,
      helveticaFont,
      fontSizeCaption,
    ),
    fontSize: fontSizeCaption,
    xPos: horizontalMargin,
    yPos: 2534,
  };

  const contentPetitionerLabel = {
    content: 'Petitioner(s)',
    fontSize: fontSizeCaption,
    xPos: 531,
    yPos: getYOffsetFromPreviousContentArea(
      contentCaseCaptionPet,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.sizeAtHeight(fontSizeCaption),
    ),
  };

  const contentVLabel = {
    content: 'v.',
    fontSize: fontSizeCaption,
    xPos: 531,
    yPos: getYOffsetFromPreviousContentArea(
      contentPetitionerLabel,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.sizeAtHeight(fontSizeCaption),
    ),
  };

  const contentCaseCaptionResp = {
    content: wrapText(
      getContentByKey('caseCaptionRespondent'),
      1042,
      helveticaFont,
      fontSizeCaption,
    ),
    fontSize: fontSizeCaption,
    xPos: horizontalMargin,
    yPos: getYOffsetFromPreviousContentArea(
      contentVLabel,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.sizeAtHeight(fontSizeCaption),
    ),
  };

  const contentRespondentLabel = {
    content: 'Respondent',
    fontSize: fontSizeCaption,
    xPos: 531,
    yPos: getYOffsetFromPreviousContentArea(
      contentCaseCaptionResp,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.sizeAtHeight(fontSizeCaption),
    ),
  };

  const contentElectronicallyFiled = {
    content: getContentByKey('originallyFiledElectronically'),
    fontSize: fontSizeCaption,
    xPos: 1530,
    yPos: contentPetitionerLabel.yPos,
  };

  const contentMailingDate = {
    content: getContentByKey('mailingDate'),
    fontSize: fontSizeCaption,
    xPos: 1530,
    yPos: contentVLabel.yPos + 125,
  };

  const contentDocketNumber = {
    content: `Docket Number: ${getContentByKey('docketNumber')}`,
    fontSize: fontSizeCaption,
    xPos: 1530,
    yPos: contentVLabel.yPos,
  };

  const contentDocumentTitle = {
    centerTextAt: {
      centerXOffset: 531, // same x offset as xpos
      centerXWidth: 1488, // same width as wrap text method
      fontObj: helveticaFont,
    },
    content: wrapText(
      getContentByKey('documentTitle'),
      1488,
      helveticaFont,
      fontSizeTitle,
    ),
    fontSize: fontSizeTitle,
    xPos: 531,
    yPos: getYOffsetFromPreviousContentArea(
      contentRespondentLabel,
      helveticaFont,
      fontSizeCaption,
      helveticaFont.sizeAtHeight(fontSizeCaption) * 8,
    ),
  };

  const contentCertificateOfService = {
    content: getContentByKey('includesCertificateOfService'),
    xPos: horizontalMargin,
    yPos: getYOffsetFromPreviousContentArea(
      contentDocumentTitle,
      helveticaFont,
      fontSizeTitle,
      helveticaFont.sizeAtHeight(fontSizeCaption) * 10,
    ),
  };

  const contentDateServed = {
    centerTextAt: {
      centerXOffset: 531, // same x offset as xpos
      centerXWidth: 1488, // same width as wrap text method
      fontObj: helveticaFont,
    },
    content: getContentByKey('dateServed'),
    fontName: helveticaBoldFont,
    fontSize: fontSizeCaption,
    xPos: 531,
    yPos: 231,
  };

  const drawContent = (page, contentArea) => {
    const {
      centerTextAt,
      content,
      fontName,
      fontSize,
      xPos,
      yPos,
    } = contentArea;

    const params = {
      color: rgb(0, 0, 0),
      font: fontName || defaultFontName,
      lineHeight: pageScaler(paddedLineHeight(fontSize)),
      size: pageScaler(fontSize || defaultFontSize),
      x: pageScaler(xPos),
      y: pageScaler(yPos),
    };

    const centeringText = !!(
      centerTextAt && Object.keys(centerTextAt).length === 3
    );

    const setCenterPos = (content, params) => {
      if (centeringText === false) {
        return params;
      }

      const { centerXOffset, centerXWidth, fontObj } = centerTextAt;
      const textWidth = fontObj.widthOfTextAtSize(content, params.size);
      const newXOffset =
        (pageScaler(centerXWidth) - textWidth) / 2 + pageScaler(centerXOffset);
      return {
        ...params,
        x: newXOffset,
      };
    };

    if (Array.isArray(content)) {
      if (centeringText === true) {
        // We do this because we need to insert the lines individually
        const contentLines = content.map((cont, idx) => {
          const newParams = setCenterPos(cont, params);
          newParams.y = params.y - params.lineHeight * idx;
          return page.drawText('' + cont, newParams);
        });
        return contentLines;
      } else {
        page.drawText('' + content.join(' '), params);
        return;
      }
    } else {
      return page.drawText('' + content, setCenterPos(content, params));
    }
  };

  coverPage.drawImage(pngSeal, {
    height: pageScaler(pngSeal.height / 2),
    width: pageScaler(pngSeal.width / 2),
    x: pageScaler(horizontalMargin),
    y: pageScaler(translateY(verticalMargin + pngSeal.height / 2)),
  });

  [
    contentDateReceivedLabel,
    contentDateReceived,
    contentDateLodgedLabel,
    contentDateLodged,
    contentDateFiledLabel,
    contentDateFiled,
    contentCaseCaptionPet,
    contentPetitionerLabel,
    contentVLabel,
    contentCaseCaptionResp,
    contentRespondentLabel,
    contentElectronicallyFiled,
    contentDocketNumber,
    contentMailingDate,
    contentDocumentTitle,
    contentCertificateOfService,
    contentDateServed,
  ].map(cont => drawContent(coverPage, cont));

  return pdfDoc.save();
};

/**
 * addCoversheetInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @param {string} providers.documentId the document id
 * @returns {Uint8Array} the new pdf data
 */
exports.addCoversheetInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  applicationContext.logger.time('Fetching the Case');
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });
  applicationContext.logger.timeEnd('Fetching the Case');

  const caseEntity = new Case(caseRecord, { applicationContext });

  const documentEntity = caseEntity.documents.find(
    document => document.documentId === documentId,
  );

  const documentIndex = caseEntity.documents.findIndex(
    document => document.documentId === documentId,
  );

  applicationContext.logger.time('Fetching S3 File');
  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();
  applicationContext.logger.timeEnd('Fetching S3 File');

  const newPdfData = await exports.addCoverToPdf({
    applicationContext,
    caseEntity,
    documentEntity,
    pdfData,
  });

  documentEntity.setAsProcessingStatusAsCompleted();

  applicationContext.logger.time('Updating Document Status');
  await applicationContext
    .getPersistenceGateway()
    .updateDocumentProcessingStatus({
      applicationContext,
      caseId,
      documentIndex,
    });
  applicationContext.logger.timeEnd('Updating Document Status');

  applicationContext.logger.time('Saving S3 Document');
  await applicationContext
    .getPersistenceGateway()
    .saveDocument({ applicationContext, document: newPdfData, documentId });
  applicationContext.logger.timeEnd('Saving S3 Document');

  return newPdfData;
};
