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
  let browser;
  let result;
  try {
    const chromium = applicationContext.getChromium();

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    let page = await browser.newPage();

    await page.setContent(htmlString);

    const headerTemplate = `
      <!doctype html>
      <html>
        <body>
          <div style="font-size: 14px; width: 100%; margin: 20px 50px 20px 50px;">
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

    await page.addStyleTag({
      content: '@page:first {margin-top: 0;} body {margin-top: 1cm;}',
    });

    result = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate: '<div></div>',
      format: 'letter',
      headerTemplate,
    });
  } catch (error) {
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return result;
};
