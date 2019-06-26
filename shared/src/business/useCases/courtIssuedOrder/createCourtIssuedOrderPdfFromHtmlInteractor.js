/**
 *
 * createCourtIssuedOrderPdfFromHtml
 * @param applicationContext
 * @param htmlString
 * @returns Buffer result the pdf as a binary buffer
 */
exports.createCourtIssuedOrderPdfFromHtml = async ({
  applicationContext,
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
      <html>
        <body>
          <div style='font-size: 14px'>
            <div style='float: right'>
              Page <span class='pageNumber'></span> 
              of <span class='totalPages'></span>
            </div>
            <div style='float: left'>
              Docket 123-19
            </div>
          </div>
        </body>
      </html>
    `;

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
