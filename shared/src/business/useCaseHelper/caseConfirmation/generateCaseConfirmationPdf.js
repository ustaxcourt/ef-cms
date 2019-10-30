const DateHandler = require('../../utilities/DateHandler');
const fs = require('fs');
const pug = require('pug');
const sass = require('node-sass');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

const confirmSassContent = fs.readFileSync(
  './shared/src/business/useCaseHelper/caseConfirmation/caseConfirmation.scss',
  'utf-8',
);
const confirmPugContent = fs.readFileSync(
  './shared/src/business/useCaseHelper/caseConfirmation/caseConfirmation.pug',
  'utf-8',
);
const ustcLogoBuffer = fs.readFileSync('./shared/static/images/ustc_seal.png');

/**
 *
 * @param {object} caseInfo a case entity
 * @returns {object} the formatted information needed by the PDF
 */
const formattedCaseInfo = caseInfo => {
  const { servedAt } = caseInfo.documents.find(doc => doc.servedAt);
  const formattedInfo = Object.assign(
    {
      docketNumber: `${caseInfo.docketNumber}${caseInfo.docketNumberSuffix ||
        ''}`,
      initialTitle: caseInfo.initialTitle,
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

const generateCaseConfirmationPage = async caseInfo => {
  const logoBase64 = `data:image/png;base64,${ustcLogoBuffer.toString(
    'base64',
  )}`;
  const { css } = await new Promise(resolve => {
    sass.render({ data: confirmSassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(confirmPugContent);
  const html = compiledFunction({
    ...formattedCaseInfo(caseInfo),
    css,
    logo: logoBase64,
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

    const contentResult = await generateCaseConfirmationPage(caseEntity);
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
    const documentsBucket = applicationContext.environment.documentsBucketName;
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
