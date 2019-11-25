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
    css,
  });
  return html;
};

exports.generatePage = generatePage;

/**
 * Generate Notice of Docket Change PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketChangeInfo contains information about what has changed
 * @returns {Promise<*>} the promise of the document having been uploaded
 */
exports.generateNoticeOfDocketChangePdf = async ({
  applicationContext,
  docketChangeInfo,
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

  const documentId = applicationContext.getUniqueId();

  await new Promise(resolve => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: result,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: documentId,
    };

    s3Client.upload(params, resolve);
  });

  return documentId;
};
