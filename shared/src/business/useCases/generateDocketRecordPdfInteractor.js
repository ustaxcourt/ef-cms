/**
 * generateDocketRecordPdfInteractor
 *
 * @param docketRecordHtml {string}
 * @param coverSheetData
 */
exports.generateDocketRecordPdfInteractor = async ({
  applicationContext,
  docketNumber,
  docketRecordHtml,
}) => {
  let browser = null;
  let result = null;

  try {
    applicationContext.logger.time('Generating Docket Record PDF');
    const chromium = applicationContext.getChromium();

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    let page = await browser.newPage();

    await page.setContent(docketRecordHtml);

    const headerTemplate = `
      <!doctype html>
      <html>
        <head>
        </head>
        <body style="margin: 0px;">
          <div style="font-size: 8px; font-family: sans-serif; width: 100%; margin: 20px 40px;">
            <div style="float: right">
              Docket Number: ${docketNumber}
            </div>
            <div style="font-size: 8px; font-family: sans-serif; float: left;">
              Page <span class="pageNumber"></span>
              of <span class="totalPages"></span>
            </div>
          </div>
        </body>
      </html>
    `;

    const footerTemplate = `
      <!doctype html>
      <html>
        <body style="margin: 0px;>
          <div></div>
        </body>
      </html>
    `;

    result = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate,
      format: 'Letter',
      headerTemplate,
      margin: {
        bottom: '200px',
        top: '100px',
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
  applicationContext.logger.timeEnd('Generating Docket Record PDF');
  return result;
};
