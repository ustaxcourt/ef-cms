import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Adds page number headers and date-printed footers to every page of a PDF
 * document using pdf-lib text overlays.
 *
 * Header (pages 2+): "Docket No.: {docketNumber}" on the left,
 *                     "Page {n} of {total}" on the right.
 * Footer (all pages): "Printed {datePrinted}" centered.
 *
 * This is used after merging chunked PDFs so that page numbering is
 * accurate across the entire merged document.
 */
export const addPageNumbersToPdf = async ({
  datePrinted,
  docketNumber,
  pdfData,
}: {
  datePrinted: string;
  docketNumber: string;
  pdfData: Uint8Array;
}): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(pdfData);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  // PDF coordinates: origin at bottom-left, units in points (72pt = 1 inch).
  // Letter size = 612 x 792 pt.
  // The content area uses top margin ~80px (≈60pt) and bottom margin ~100px (≈75pt).
  // We draw header/footer text within these margin areas.

  const HEADER_FONT_SIZE = 9;
  const FOOTER_FONT_SIZE = 7.5;
  const LEFT_MARGIN = 52; // ~40px at 96dpi → 30pt, plus some padding
  const HEADER_Y = 760; // within the 80px (60pt) top margin, from bottom of page
  const FOOTER_Y = 30; // within the 100px (75pt) bottom margin, from bottom of page
  const TEXT_COLOR = rgb(0, 0, 0);

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    const pageNumber = i + 1;

    // Header on pages 2+ (page 1 has the court header, no page number)
    if (pageNumber > 1) {
      const headerLeft = `Docket No.: ${docketNumber}`;
      const headerRight = `Page ${pageNumber} of ${totalPages}`;
      const rightTextWidth = font.widthOfTextAtSize(
        headerRight,
        HEADER_FONT_SIZE,
      );

      page.drawText(headerLeft, {
        font,
        size: HEADER_FONT_SIZE,
        x: LEFT_MARGIN,
        y: HEADER_Y,
        color: TEXT_COLOR,
      });

      page.drawText(headerRight, {
        font,
        size: HEADER_FONT_SIZE,
        x: width - LEFT_MARGIN - rightTextWidth,
        y: HEADER_Y,
        color: TEXT_COLOR,
      });
    }

    // Footer on all pages
    const footerText = `Printed ${datePrinted}`;
    const footerTextWidth = font.widthOfTextAtSize(
      footerText,
      FOOTER_FONT_SIZE,
    );

    page.drawText(footerText, {
      font,
      size: FOOTER_FONT_SIZE,
      x: (width - footerTextWidth) / 2,
      y: FOOTER_Y,
      color: TEXT_COLOR,
    });
  }

  return pdfDoc.save();
};
