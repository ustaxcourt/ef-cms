/**
 *
 * createCourtIssuedOrderPdfFromHtml
 * @param applicationContext
 * @param htmlString
 * @returns Buffer result the pdf as a binary buffer
 */
exports.createCourtIssuedOrderPdfFromHtml = async ({
  applicationContext,
  docketNumberWithSuffix,
  htmlString,
}) => {
  let browser = null;
  let result = null;

  try {
    const chromium = applicationContext.getChromium();

    await chromium.font(
      'https://rawcdn.githack.com/googlefonts/noto-fonts/7cc126f6c0ebfe750dc911dae951f9167d36213e/unhinted/NotoSerif-Regular.ttf',
    );

    applicationContext.logger.info('gotChromium');

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    applicationContext.logger.info('have browser');

    let page = await browser.newPage();

    applicationContext.logger.info('have page');

    await page.setContent(htmlString);

    const headerTemplate = `
      <!doctype html>
      <html>
        <body>
          <div style="font-size: 10px; font-family: 'Noto Serif', serif; width: 100%; margin: 20px 62px 20px 62px;">
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
          <div style="font-size: 10px; font-family: 'Noto Serif', serif; width: 100%; margin: 20px 62px 20px 62px;">
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
