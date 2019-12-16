const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * @param {Array} cases case entities
 * @returns {string} an html string resulting from rendering template with caseInfo
 */
const generatePendingReportPage = async ({
  applicationContext,
  pendingItems,
  reportTitle,
}) => {
  const pendingReportSassContent = require('./../../assets/ustcPdf.scss_');

  const pendingReportTemplateContent = require('./pendingReport.pug_');

  const ustcLogoBufferBase64 = require('../../../../static/images/ustc_seal.png_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: pendingReportSassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(pendingReportTemplateContent);
  const html = compiledFunction({
    logo: ustcLogoBufferBase64,
    pendingItems,
    reportTitle,
    styles: css,
  });
  return html;
};

/**
 * Generate Pending Report PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseEntity a case entity with its documents
 * @returns {Promise<*>} the promise of the document having been uploaded
 */
exports.generatePendingReportPdf = async ({
  applicationContext,
  pendingItems,
  reportTitle,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let browser = null;
  let result = null;

  try {
    browser = await applicationContext.getChromiumBrowser();
    let page = await browser.newPage();

    let formattedPendingItems = pendingItems.map(pendingItem => ({
      ...pendingItem,
      associatedJudgeFormatted: pendingItem.associatedJudge.replace(
        /^Judge\s+/,
        '',
      ),
      caseCaptionNames: applicationContext.getCaseCaptionNames(
        pendingItem.caseCaption || '',
      ),
      formattedFiledDate: applicationContext
        .getUtilities()
        .formatDateString(pendingItem.receivedAt, 'MMDDYY'),
      formattedName: pendingItem.documentTitle || pendingItem.documentType,
    }));

    const contentResult = await generatePendingReportPage({
      applicationContext,
      pendingItems: formattedPendingItems,
      reportTitle,
    });
    await page.setContent(contentResult);

    result = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate: `
        <div style="font-size:8px !important; color:#000; text-align:center; width:100%; margin-bottom:5px;">Printed <span class="date"></span></div>
      `,
      format: 'letter',
      headerTemplate: `<!doctype html>
        <html>
          <head>
          </head>
          <body style="margin: 0px;">
            <div style="font-size: 8px; font-family: sans-serif; width: 100%; margin: 0px 1cm; margin-top: 25px;">
              <div style="font-size: 8px; font-family: sans-serif; float: right;">
                Page <span class="pageNumber"></span>
                of <span class="totalPages"></span>
              </div>
            </div>
          </body>
        </html>
      `,
      margin: {
        bottom: '100px',
        top: '80px',
      },
    });
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  const documentId = `pending-report-${applicationContext.getUniqueId()}.pdf`;

  await new Promise(resolve => {
    const documentsBucket =
      applicationContext.environment.tempDocumentsBucketName;
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: result,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: documentId,
    };

    s3Client.upload(params, function() {
      resolve();
    });
  });

  const {
    url,
  } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    documentId,
    useTempBucket: true,
  });

  return url;
};
