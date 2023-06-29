import { isEmpty } from 'lodash';

/**
 * scrapes the text content out of a pdf
 *
 * @param {string} pdfBuffer the buffer for the pdf content
 * @returns {Promise} the template with the brackets replaced with replacement values
 */
export const scrapePdfContents = async ({ applicationContext, pdfBuffer }) => {
  let pdfjsLib;

  try {
    pdfjsLib = await applicationContext.getPdfJs();

    const document = await pdfjsLib.getDocument(pdfBuffer).promise;

    let scrapedText = '';

    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i);
      const pageTextContent = await page.getTextContent({
        disableCombineTextItems: false,
        normalizeWhitespace: false,
      });

      let lastY = null,
        pageText = '';

      for (let item of pageTextContent.items) {
        if (lastY === item.transform[5] || !lastY) {
          pageText += '' + item.str;
        } else {
          pageText += '\n' + item.str;
        }
        lastY = item.transform[5];
      }

      if (!isEmpty(pageText)) {
        scrapedText += '\n\n' + pageText;
      }
    }

    return scrapedText;
  } catch (e) {
    const pdfjsVersion = pdfjsLib && pdfjsLib.version;
    throw new Error(
      `Error scraping PDF with PDF.JS v${pdfjsVersion} ${e.message}`,
    );
  }
};
