const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * @param {Array} cases case entities
 * @returns {string} an html string resulting from rendering template with caseInfo
 */
const generateCaseInventoryReportPage = async ({
  applicationContext,
  formattedCases,
  reportTitle,
}) => {
  const caseInventoryReportSassContent = require('./../../assets/ustcPdf.scss_');

  const caseInventoryReportTemplateContent = require('./caseInventoryReport.pug_');

  const ustcLogoBufferBase64 = require('../../../../static/images/ustc_seal.png_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: caseInventoryReportSassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(caseInventoryReportTemplateContent);
  const html = compiledFunction({
    formattedCases,
    logo: ustcLogoBufferBase64,
    reportTitle,
    styles: css,
  });
  return html;
};

/**
 * Generate Case Inventory Report PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseEntity a case entity with its documents
 * @returns {Promise<*>} the promise of the document having been uploaded
 */
exports.generateCaseInventoryReportPdf = async ({
  applicationContext,
  cases,
  filters,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  let browser = null;
  let result = null;

  try {
    browser = await applicationContext.getChromiumBrowser();
    let page = await browser.newPage();

    let formattedCases = cases
      .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
      .map(caseItem => ({
        ...caseItem,
        caseCaptionNames: applicationContext.getCaseCaptionNames(
          caseItem.caseCaption || '',
        ),
      }));

    let reportTitle;
    if (filters.status) {
      reportTitle = filters.status;
    }
    if (filters.status && filters.associatedJudge) {
      reportTitle += ' - ';
    }
    if (filters.associatedJudge) {
      reportTitle += filters.associatedJudge;
    }

    const contentResult = await generateCaseInventoryReportPage({
      applicationContext,
      formattedCases,
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

  const documentId = `case-inventory-${applicationContext.getUniqueId()}.pdf`;

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
