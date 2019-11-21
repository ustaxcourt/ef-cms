const DateHandler = require('../../utilities/DateHandler');

const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} caseInfo a case entity
 * @returns {object} the formatted information needed by the PDF
 */
const formattedCaseInfo = caseInfo => {
  const { servedAt } = caseInfo.documents.find(doc => doc.servedAt);
  const countryName =
    caseInfo.contactPrimary.countryType != 'domestic'
      ? caseInfo.contactPrimary.country
      : '';
  const formattedInfo = Object.assign(
    {
      caseTitle: caseInfo.caseTitle,
      countryName,
      docketNumber: `${caseInfo.docketNumber}${caseInfo.docketNumberSuffix ||
        ''}`,
      preferredTrialCity: caseInfo.preferredTrialCity,
      receivedAtFormatted: DateHandler.formatDateString(
        caseInfo.receivedAt,
        'MONTH_DAY_YEAR',
      ),
      servedDate: DateHandler.formatDateString(servedAt, 'MONTH_DAY_YEAR'),
      todaysDate: DateHandler.formatNow('MONTH_DAY_YEAR'),
    },
    caseInfo.contactPrimary,
  );
  return formattedInfo;
};

/**
 *
 * @param {object} caseInfo a raw object representing a petition
 * @returns {string} an html string resulting from rendering template with caseInfo
 */
const generateCaseConfirmationPage = async ({
  applicationContext,
  caseEntity,
}) => {
  const confirmSassContent = require('./../../assets/ustcPdf.scss_');
  const confirmTemplateContent = require('./caseConfirmation.pug_');
  const ustcLogoBufferBase64 = require('../../../../static/images/ustc_seal.png_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: confirmSassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(confirmTemplateContent);
  const html = compiledFunction({
    ...formattedCaseInfo(caseEntity),
    css,
    logo: ustcLogoBufferBase64,
  });
  return html;
};

/**
 * generateCaseConfirmationPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseEntity a case entity with its documents
 * @returns {Promise<*>} the promise of the document having been uploaded
 */
exports.generateCaseConfirmationPdf = async ({
  applicationContext,
  caseEntity,
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

    const contentResult = await generateCaseConfirmationPage({
      applicationContext,
      caseEntity,
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

  const documentId = `case-${caseEntity.docketNumber}-confirmation.pdf`;

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
};
