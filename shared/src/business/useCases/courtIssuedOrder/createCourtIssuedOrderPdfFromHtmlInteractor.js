const chromium = require('chrome-aws-lambda');

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
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    let page = await browser.newPage();

    await page.goto('https://example.com');

    result = await page.title();
  } catch (error) {
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return result;
};
