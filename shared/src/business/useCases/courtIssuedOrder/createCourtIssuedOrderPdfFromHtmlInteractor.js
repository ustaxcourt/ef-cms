/**
 *
 * createCourtIssuedOrderPdfFromHtmlInteractor
 * @param applicationContext
 * @param htmlString
 * @returns Buffer result the pdf as a binary buffer
 */
exports.createCourtIssuedOrderPdfFromHtmlInteractor = async ({
  applicationContext,
  docketNumberWithSuffix,
  htmlString,
}) => {
  let browser = null;
  let result = null;

  try {
    const chromium = applicationContext.getChromium();

    await chromium.font(
      'https://rawcdn.githack.com/byrongibson/fonts/fde1dda023ab36b97aaff858b31f96c8f262d142/backup/truetype.original/msttcorefonts/Times_New_Roman.ttf?raw=true',
    );
    await chromium.font(
      'https://rawcdn.githack.com/byrongibson/fonts/fde1dda023ab36b97aaff858b31f96c8f262d142/backup/truetype.original/msttcorefonts/Times_New_Roman_Bold.ttf?raw=true',
    );
    await chromium.font(
      'https://rawcdn.githack.com/byrongibson/fonts/fde1dda023ab36b97aaff858b31f96c8f262d142/backup/truetype.original/msttcorefonts/Times_New_Roman_Bold_Italic.ttf?raw=true',
    );
    await chromium.font(
      'https://rawcdn.githack.com/byrongibson/fonts/fde1dda023ab36b97aaff858b31f96c8f262d142/backup/truetype.original/msttcorefonts/Times_New_Roman_Italic.ttf?raw=true',
    );

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
          <div style="font-size: 10px; font-family: 'Times New Roman', Times, serif; width: 100%; margin: 20px 62px 20px 62px;">
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
          <div style="font-size: 10px; font-family: 'Times New Roman', Times, serif; width: 100%; margin: 20px 62px 20px 62px;">
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
