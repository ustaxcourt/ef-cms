import { createApplicationContext } from '../../../src/applicationContext';
import { headerFontFace } from '../../../../shared/src/business/useCases/headerFontFace';
import { reactTemplateGenerator } from '../../../../shared/src/business/utilities/generateHTMLTemplateForPDF/reactTemplateGenerator';

/**
 * handler
 */
export const handler = async (event, context, cb) => {
  console.log('event', event);

  const applicationContext = createApplicationContext();

  let browser = null;
  let result: any = null;

  try {
    browser = await applicationContext.getChromiumBrowser();

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
      await browser.close();
    }
  }
  return result;
};
