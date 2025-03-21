import { ServerApplicationContext } from '@web-api/applicationContext';
import { getPdfJs } from '@shared/business/utilities/pdfs/getPdfJs';
import { isEmpty } from 'lodash';

export const scrapePdfContents = async ({
  pdfBuffer,
}: {
  applicationContext: ServerApplicationContext;
  pdfBuffer: Uint8Array;
}) => {
  const pdfjsLib = await getPdfJs();

  try {
    const document = await pdfjsLib.getDocument({
      data: pdfBuffer,
      isEvalSupported: false,
    }).promise;

    let scrapedText = '';

    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i);
      const pageTextContent = await page.getTextContent({
        disableCombineTextItems: false,
        normalizeWhitespace: false,
      });

      let lastY = null,
        pageText = '';

      for (const item of pageTextContent.items) {
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
