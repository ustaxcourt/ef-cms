const sassContent = require('../../assets/ustcPdf.scss_');
const template = require('./noticeOfDocketChange.pug_');
const ustcLogoBufferBase64 = require('../../../../static/images/ustc_seal.png_');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * @param {Array} cases case entities
 * @returns {string} an html string resulting from rendering template with caseInfo
 */
const generatePage = async ({ applicationContext, docketChangeInfo }) => {
  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: sassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(template);
  const html = compiledFunction({
    logo: ustcLogoBufferBase64,
    ...docketChangeInfo,
    styles: css,
  });
  return html;
};

exports.generatePage = generatePage;

/**
 * Generate Notice of Docket Change PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseEntity a case entity with its documents
 * @returns {Promise<*>} the promise of the document having been uploaded
 */
exports.generateNoticeOfDocketChangePdf = async ({
  applicationContext,
  docketChangeInfo,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    console.log('OH NO MR BILL');
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

    const contentResult = await generatePage({
      applicationContext,
      docketChangeInfo,
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

  const documentId = `notice-docket-change-${applicationContext.getUniqueId()}.pdf`;

  await new Promise(resolve => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
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
  });

  return url;
};
