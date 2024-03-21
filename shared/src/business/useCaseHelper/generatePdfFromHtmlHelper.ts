import { PageMetaHeaderDocket } from '@shared/business/utilities/pdfGenerator/components/PageMetaHeaderDocket';
import { headerFontFace } from '../useCases/headerFontFace';
import React from 'react';
import ReactDOM from 'react-dom/server';

/**
 * generatePdfFromHtmlHelper
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.contentHtml the html content for the pdf
 * @param {boolean} providers.displayHeaderFooter boolean to determine if the header and footer should be displayed
 * @returns {Buffer} the pdf as a binary buffer
 */
export const generatePdfFromHtmlHelper = async (
  applicationContext: IApplicationContext,
  {
    contentHtml,
    displayHeaderFooter = true,
    docketNumber,
    footerHtml,
    headerHtml,
    overwriteFooter,
  }: {
    contentHtml: string;
    displayHeaderFooter: boolean;
    docketNumber?: string;
    footerHtml?: string;
    headerHtml?: string;
    overwriteFooter?: string;
  },
  browser,
) => {
  let result: any = null;

  try {
    let page = await browser?.newPage()!;

    await page.setContent(contentHtml);

    if (headerHtml === undefined) {
      headerHtml = ReactDOM.renderToString(
        React.createElement(PageMetaHeaderDocket, {
          docketNumber,
        }),
      );
    }

    const headerTemplate = `
          <div style="font-size: 8px; width: 100%; margin: 0px 40px; margin-top: 25px;">
            ${headerHtml}
          </div>
    `;

    const footerTemplate = overwriteFooter
      ? `${footerHtml || ''}`
      : `
          <div class="footer-default" style="font-size: 8px; font-family: sans-serif; width: 100%; margin: 0px 40px; margin-top: 25px;">
            ${footerHtml || ''}
          </div>`;

    const firstPage = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate,
      format: 'Letter',
      margin: {
        bottom: '100px',
        top: '80px',
      },
      pageRanges: '1',
      printBackground: true,
    });

    let remainingPages: any;
    try {
      remainingPages = await page.pdf({
        displayHeaderFooter,
        footerTemplate,
        format: 'Letter',
        headerTemplate: `<style>${headerFontFace}</style>${headerTemplate}`,
        margin: {
          bottom: '100px',
          top: '80px',
        },
        pageRanges: '2-',
        printBackground: true,
      });
    } catch (err) {
      // this was probably a 1 page document
      const error = err as Error;
      if (!error.message.includes('Page range exceeds page count')) {
        throw err;
      }
    }

    if (remainingPages) {
      const returnVal = await applicationContext.getUtilities().combineTwoPdfs({
        applicationContext,
        firstPdf: firstPage,
        secondPdf: remainingPages,
      });
      result = Buffer.from(returnVal);
    } else {
      result = firstPage;
    }
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  }

  return result;
};
