const getPageDimensionsWithTrim = page => {
  const sizeCropBox = page.getCropBox();
  const sizeTrimBox = page.getTrimBox();
  return {
    pageHeight: sizeCropBox.height,
    pageWidth: sizeTrimBox.width,
    startingY: sizeCropBox.y,
  };
};

const computeCoordinates = ({
  boxHeight,
  boxWidth,
  pageHeight,
  pageRotation,
  pageWidth,
  posY,
}) => {
  let rotationRads = (pageRotation * Math.PI) / 180;
  let coordsFromBottomLeft = {};
  if (pageRotation === 90 || pageRotation === 270) {
    coordsFromBottomLeft.x = pageHeight / 2 - boxWidth / 2;
  } else {
    coordsFromBottomLeft.x = pageWidth / 2 - boxWidth / 2;
  }

  coordsFromBottomLeft.y = posY + boxHeight;

  let rectangleX, rectangleY;

  if (pageRotation === 90) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads);
  } else if (pageRotation === 180) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;
  } else if (pageRotation === 270) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads);
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;
  } else {
    rectangleX = coordsFromBottomLeft.x;
    rectangleY = coordsFromBottomLeft.y;
  }
  return { rectangleX, rectangleY };
};

/**
 * addServedStampToDocument
 *
 * @param {object} providers the providers object
 * @param {object} providers.pdfData the original document pdf data
 * @param {string} providers.serviceStampText the service stamp text to add to the document
 * @returns {object} the new pdf with the stamp at the bottom center of the document
 */
exports.addServedStampToDocument = async ({
  applicationContext,
  pdfData,
  serviceStampText,
}) => {
  if (!serviceStampText) {
    serviceStampText = `SERVED ${applicationContext
      .getUtilities()
      .formatNow('MM/DD/YY')}`;
  }

  const {
    degrees,
    PDFDocument,
    rgb,
    StandardFonts,
  } = await applicationContext.getPdfLib();

  const scale = 1;
  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const { pageHeight, pageWidth, startingY } = getPageDimensionsWithTrim(page);

  const helveticaBoldFont = pdfDoc.embedStandardFont(
    StandardFonts.HelveticaBold,
  );

  const textSize = 14 * scale;
  const padding = 3 * scale;
  const serviceStampWidth = helveticaBoldFont.widthOfTextAtSize(
    serviceStampText,
    textSize,
  );
  const textHeight = helveticaBoldFont.sizeAtHeight(textSize);
  const boxWidth = serviceStampWidth + padding * 2;
  const boxHeight = textHeight + padding * 2;
  const posY = startingY + padding * 2;

  const rotationAngle = page.getRotation().angle;
  const shouldRotateStamp = rotationAngle !== 0;
  const rotateSignatureDegrees = degrees(rotationAngle);

  const { rectangleX, rectangleY } = computeCoordinates({
    boxHeight,
    boxWidth,
    pageHeight,
    pageRotation: rotationAngle,
    pageWidth,
    posY,
  });

  const rotate = shouldRotateStamp ? rotateSignatureDegrees : degrees(0);

  page.drawRectangle({
    color: rgb(1, 1, 1),
    height: boxHeight,
    rotate,
    width: boxWidth,
    x: rectangleX,
    y: rectangleY + padding,
  });
  page.drawText(serviceStampText, {
    font: helveticaBoldFont,
    rotate,
    size: textSize,
    x: rectangleX + padding,
    y: rectangleY + padding * 2,
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};

exports.computeCoordinates = computeCoordinates;
