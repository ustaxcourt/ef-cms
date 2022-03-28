const {
  reactTemplateGenerator,
} = require('../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const { headerFontFace } = require('./headerFontFace');

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
exports.generatePdfFromHtmlInteractor = async (
  applicationContext,
  {
    contentHtml,
    displayHeaderFooter = true,
    docketNumber,
    footerHtml,
    headerHtml,
    overwriteFooter,
  },
) => {
  let browser = null;
  let result = null;

  try {
    browser = await applicationContext.getChromiumBrowser();
    let page = await browser.newPage();

    await page.setContent(contentHtml);

    let metaHeaderContent = '';
    if (headerHtml !== undefined) {
      metaHeaderContent = headerHtml;
    } else {
      metaHeaderContent = reactTemplateGenerator({
        componentName: 'PageMetaHeaderDocket',
        data: {
          docketNumber,
        },
      });
    }

    const headerTemplate = `
          <div style="font-size: 8px; width: 100%; margin: 0px 40px; margin-top: 25px;">
            ${metaHeaderContent}
          </div>
    `;

    const footerTemplate = overwriteFooter
      ? `${footerHtml || ''}`
      : `
          <div class="footer-default" style="font-size: 8px; font-family: sans-serif; width: 100%; margin: 0px 40px; margin-top: 25px;">
            ${footerHtml || ''}
          </div>`;

    result = await page.pdf({
      displayHeaderFooter,
      footerTemplate,
      format: 'Letter',
      headerTemplate: `<style>${headerFontFace}</style>${headerTemplate}`,
      margin: {
        bottom: '100px',
        top: '80px',
      },
      printBackground: true,
    });
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
