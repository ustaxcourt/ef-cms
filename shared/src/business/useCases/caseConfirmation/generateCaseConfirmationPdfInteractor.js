const {
  isAuthorized,
  PETITION,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * generateCaseConfirmationPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @returns {Promise<*>} the promise of the document having been uploaded
 */
exports.generateCaseConfirmationPdfInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  let browser = null;
  let result = null;

  try {
    const chromium = applicationContext.getChromium();

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    let page = await browser.newPage();

    await page.setContent(
      ' <div style="font-size: 10px; font-family: serif; width: 100%; margin: 20px 62px 20px 62px;"></div>',
    );

    const headerTemplate = `
      <!doctype html>
      <html>
        <head>
          <style>
            ${pdfStyles}
          </style>
        </head>
        <body>
          <div style="font-size: 10px; font-family: 'nimbus_roman', serif; width: 100%; margin: 20px 62px 20px 62px;">
          </div>
        </body>
      </html>
    `;

    const footerTemplate = `
      <!doctype html>
      <html>
        <body>
          <div style="font-size: 10px; font-family: serif; width: 100%; margin: 20px 62px 20px 62px;">
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

  const documentId = `Case ${caseToUpdate.docketNumber} Confirmation.pdf`;
  const caseConfirmationBlob = new Blob([result], { type: 'application/pdf' });
  const caseConfirmationPdf = new File([caseConfirmationBlob], documentId, {
    type: 'application/pdf',
  });

  const caseConfirmationDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: caseConfirmationPdf,
      documentId: documentId,
      onUploadProgress: () => {},
    });

  return caseConfirmationDocumentId;
};
