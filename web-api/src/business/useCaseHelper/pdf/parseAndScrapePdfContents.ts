import { ServerApplicationContext } from '@web-api/applicationContext';

/**
 * Parse and Scrape PDF Contents
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.pdfBuffer the pdf buffer
 * @returns {object} the parsed and scraped pdf contents
 */
export const parseAndScrapePdfContents = async ({
  applicationContext,
  pdfBuffer,
}: {
  applicationContext: ServerApplicationContext;
  pdfBuffer: any;
}) => {
  const arrayBuffer = new ArrayBuffer(pdfBuffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < pdfBuffer.length; ++i) {
    view[i] = pdfBuffer[i];
  }

  try {
    return await applicationContext
      .getUtilities()
      .scrapePdfContents({ applicationContext, pdfBuffer: arrayBuffer });
  } catch (e) {
    applicationContext.logger.error('Failed to parse PDF', e);
    throw e;
  }
};
