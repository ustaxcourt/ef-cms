const fs = require('fs');
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
  const pathPrefix = process.env.NODE_ENV === 'production' ? '/var/task/' : '';

  const pendingReportSassContent = fs.readFileSync(
    `${pathPrefix}shared/src/business/useCaseHelper/caseConfirmation/caseConfirmation.scss`,
    'utf8',
  );

  const pendingReportTemplateContent = fs.readFileSync(
    `${pathPrefix}shared/src/business/useCaseHelper/pendingReport/pendingReport.pug`,
    'utf8',
  );

  const ustcLogoBufferBase64 =
    'data:image/png;base64,' +
    fs.readFileSync(`${pathPrefix}shared/static/images/ustc_seal.png`, {
      encoding: 'base64',
    });

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

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

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
      formattedPendingItems,
      reportTitle,
    });
    await page.setContent(contentResult);

    result = await page.pdf({
      displayHeaderFooter: false,
      format: 'letter',
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
