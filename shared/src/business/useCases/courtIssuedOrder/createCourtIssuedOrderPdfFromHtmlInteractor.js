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
      <!doctype html>
      <html>
        <body>
          <div style="font-size: 14px; width: 100%; margin: 20px 50px 20px 50px;">
            <div style="float: right">
              Page <span class="pageNumber"></span> 
              of <span class="totalPages"></span>
            </div>
            <div style="float: left">
              Docket 123-19
            </div>
          </div>
          <script>
            document.write('hello world');
          </script>
        </body>
      </html>
    `;
    const footerTemplate = `
      <!doctype html>
      <html>
        <body>
          <div style="font-size: 14px; width: 100%; margin: 20px 50px 20px 50px;">
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
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return result;
};
