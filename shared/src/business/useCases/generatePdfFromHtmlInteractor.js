/**
 * generatePdfFromHtmlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.contentHtml the html content for the pdf
 * @param {boolean} providers.displayHeaderFooter boolean to determine if the header and footer should be displayed
 * @returns {Buffer} the pdf as a binary buffer
 */
exports.generatePdfFromHtmlInteractor = async ({
  applicationContext,
  contentHtml,
  displayHeaderFooter = true,
  docketNumber,
  headerHtml,
}) => {
  let browser = null;
  let result = null;

  try {
    applicationContext.logger.time('Generating PDF From HTML');
    const chromium = applicationContext.getChromium();

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    let page = await browser.newPage();

    await page.setContent(contentHtml);

    const headerTemplate = `
      <!doctype html>
      <html>
        <head>
        </head>
        <body style="margin: 0px;">
          <div style="font-size: 8px; font-family: sans-serif; width: 100%; margin: 0px 40px; margin-top: 25px;">
            <div style="font-size: 8px; font-family: sans-serif; float: right;">
              Page <span class="pageNumber"></span>
              of <span class="totalPages"></span>
            </div>
            <div style="float: left">
              ${headerHtml ? headerHtml : `Docket Number: ${docketNumber}`}
            </div>
          </div>
        </body>
      </html>
    `;

    const footerTemplate = `
      <div style="font-size:8px !important; color:#000; text-align:center; width:100%; margin-bottom:5px;">Printed <span class="date"></span></div>
    `;

    result = await page.pdf({
      displayHeaderFooter,
      footerTemplate: footerTemplate,
      format: 'Letter',
      headerTemplate: headerTemplate,
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
  applicationContext.logger.timeEnd('Generating PDF From HTML');
  return result;
};
