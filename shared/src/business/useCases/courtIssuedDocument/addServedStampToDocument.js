const getPageDimensionsWithTrim = page => {
  const size = page.getTrimBox();
  return [size.width, size.height, size.x, size.y];
};

const computeCoordinates = ({
  boxHeight,
  padding,
  pageHeight,
  pageRotation,
  pageWidth,
  posX,
  posY,
  scale,
  textHeight,
}) => {
  let rotationRads = (pageRotation * Math.PI) / 180;
  let coordsFromBottomLeft = {
    x: posX / scale,
  };
  if (pageRotation === 90 || pageRotation === 270) {
    coordsFromBottomLeft.y = pageWidth - (posY + boxHeight) / scale;
  } else {
    coordsFromBottomLeft.y = pageHeight - (posY + boxHeight) / scale;
  }

  let rectangleX, rectangleY, stampX, stampY;

  if (pageRotation === 90) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads);

    stampX = posY + textHeight * 2;
    stampY = posX + textHeight;
  } else if (pageRotation === 180) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;

    stampX = pageWidth - posX - padding;
    stampY = pageHeight - posY - padding;
  } else if (pageRotation === 270) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads);
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;

    stampX = pageWidth - posY - textHeight * 2;
    stampY = pageHeight - posX - textHeight;
  } else {
    rectangleX = coordsFromBottomLeft.x;
    rectangleY = coordsFromBottomLeft.y;

    stampX = posX + padding;
    stampY = posY + padding;
  }
  return { rectangleX, rectangleY, stampX, stampY };
};

exports.computeCoordinates = computeCoordinates;

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

  const [
    pageWidth,
    pageHeight,
    startingX,
    startingY,
  ] = getPageDimensionsWithTrim(page);

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
  const posX = pageWidth / 2 - boxWidth / 2;
  const posY = startingY;

  const rotationAngle = page.getRotation().angle;
  const shouldRotateStamp = rotationAngle !== 0;
  const rotateStampDegrees = degrees(rotationAngle);

  // const { rectangleX, rectangleY, stampX, stampY } = computeCoordinates({
  //   boxHeight,
  //   // boxWidth,
  //   padding,
  //   pageHeight,
  //   pageRotation: rotationAngle,
  //   pageWidth,
  //   posX,
  //   posY,
  //   scale,
  //   textHeight,
  // });

  const rotate = shouldRotateStamp ? rotateStampDegrees : degrees(0);

  page.drawRectangle({
    color: rgb(0, 1, 1),
    height: boxHeight,
    rotate,
    width: boxWidth,
    x: posX,
    y: posY,
  });
  page.drawText(serviceStampText, {
    font: helveticaBoldFont,
    rotate,
    size: textSize,
    x: posX,
    y: posY,
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
