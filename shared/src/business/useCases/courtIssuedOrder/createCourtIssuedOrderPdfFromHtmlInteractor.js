/**
 *
 * createCourtIssuedOrderPdfFromHtml
 * @param applicationContext
 * @param entryMetadata
 * @returns {object} errors (null if no errors)
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

    result = await page.pdf({
      format: 'letter',
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
