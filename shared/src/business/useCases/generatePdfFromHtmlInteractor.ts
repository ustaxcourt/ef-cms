import { headerFontFace } from './headerFontFace';
import { reactTemplateGenerator } from '../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator';

/**
 * generatePdfFromHtmlInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.contentHtml the html content for the pdf
 * @param {boolean} providers.displayHeaderFooter boolean to determine if the header and footer should be displayed
 * @returns {Buffer} the pdf as a binary buffer
 */
export const generatePdfFromHtmlInteractor = async (
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
    docketNumber: string;
    footerHtml: string;
    headerHtml: string;
    overwriteFooter: string;
  },
) => {
  let browserPid;
  let browser = null;
  let result: any = null;

  try {
    browser = await applicationContext.getChromiumBrowser();
    browserPid = browser.process()?.pid;

    let page = await browser?.newPage();

    await page.setContent(contentHtml);

    if (headerHtml === undefined) {
      headerHtml = reactTemplateGenerator({
        componentName: 'PageMetaHeaderDocket',
        data: {
          docketNumber,
        },
      });
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
      if (!err.message.includes('Page range exceeds page count')) {
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
  } finally {
    if (browser !== null) {
      if (process.env.NODE_ENV !== 'production') {
        await browser.close();
      } else {
        process.kill(browserPid);
      }
    }
  }
  return result;
};
