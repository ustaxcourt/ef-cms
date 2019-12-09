const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * generatePaperServiceAddressPage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.contactData the contact data
 * @returns {string} an html string resulting from rendering template with contactData
 */
const generatePaperServiceAddressPage = async ({
  applicationContext,
  contactData,
}) => {
  const baseSassContent = require('../../assets/ustcPdf.scss_');
  const paperServiceAddressPageTemplate = require('./paperServiceAddressPage.pug_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: baseSassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(paperServiceAddressPageTemplate);
  const html = compiledFunction({
    ...contactData,
    css,
  });
  return html;
};

/**
 * generatePaperServiceAddressPagePdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.contactData the contact data
 * @returns {Uint8Array} the generated pdf data
 */
exports.generatePaperServiceAddressPagePdf = async ({
  applicationContext,
  contactData,
  docketNumberWithSuffix,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let browser = null;
  let result = null;

  try {
    browser = await applicationContext.getChromiumBrowser();
    let page = await browser.newPage();

    const contentResult = await generatePaperServiceAddressPage({
      applicationContext,
      contactData,
    });
    await page.setContent(contentResult);

    const headerTemplate = `
      <!doctype html>
      <html>
        <head>
        </head>
        <body>
          <div style="font-size: 10px; font-family: 'nimbus_roman', serif; width: 100%; margin: 20px 62px 20px 62px;">
            Docket ${docketNumberWithSuffix}
          </div>
        </body>
      </html>
    `;

    result = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate: '',
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
