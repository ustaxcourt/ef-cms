const WATERMARK_TEXT = 'DRAFT';

export const addDraftWatermarkToDocument = async ({
  applicationContext,
  pdfFile,
}) => {
  const { degrees, rgb } = await applicationContext.getPdfLib();

  const { pdfDoc, textFont } = await applicationContext
    .getUtilities()
    .setupPdfDocument({
      applicationContext,
      pdfData: pdfFile,
    });

  const pages = pdfDoc.getPages();
  pages.forEach(page => {
    const { width } = page.getSize();

    let fontSize = 200;
    let textWidth = textFont.widthOfTextAtSize(WATERMARK_TEXT, fontSize);

    while (textWidth > width * 0.8) {
      fontSize -= 1;
      textWidth = textFont.widthOfTextAtSize(WATERMARK_TEXT, fontSize);
    }

    const centerX = width / 2 - textWidth / 2;
    const centerY = page.getSize().height / 1.85;

    page.drawText(WATERMARK_TEXT, {
      color: rgb(0, 0, 0),
      opacity: 0.15,
      rotate: degrees(-15),
      size: fontSize,
      textFont,
      x: centerX,
      y: centerY,
    });
  });

  return await pdfDoc.save({
    useObjectStreams: false,
  });
};
