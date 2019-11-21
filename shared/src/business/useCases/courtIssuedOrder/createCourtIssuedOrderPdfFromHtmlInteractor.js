const { pdfStyles } = require('../../../tools/pdfStyles');

/**
 *
 * createCourtIssuedOrderPdfFromHtmlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumberWithSuffix the docket number of the case with the suffix
 * @param {string} providers.htmlString the htmlString for the pdf content
 * @returns {Buffer} the pdf as a binary buffer
 */
exports.createCourtIssuedOrderPdfFromHtmlInteractor = async ({
  applicationContext,
  docketNumberWithSuffix,
  htmlString,
}) => {
  let browser = null;
  let result = null;

  try {
    browser = applicationContext.getChromiumBrowser();
    let page = await browser.newPage();

    await page.setContent(htmlString);

    const headerTemplate = `
      <!doctype html>
      <html>
        <head>
          <style>
            ${pdfStyles}
          </style>
        </head>
        <body>
          <div style="font-size: 10px; font-family: 'nimbus_roman', serif; width: 100%; margin: 20px 62px 20px 62px;">
            <div style="float: right">
              Page <span class="pageNumber"></span>
              of <span class="totalPages"></span>
            </div>
            <div style="float: left">
              Docket ${docketNumberWithSuffix}
            </div>
          </div>
        </body>
      </html>
    `;

    const footerTemplate = `
      <!doctype html>
      <html>
        <body>
          <div style="font-size: 10px; font-family: serif; width: 100%; margin: 20px 62px 20px 62px;">
          </div>
        </body>
      </html>
    `;

    result = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate,
      format: 'letter',
      headerTemplate,
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
