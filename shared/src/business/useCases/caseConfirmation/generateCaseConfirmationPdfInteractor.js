const pug = require('pug');
const sass = require('node-sass');
const fs = require('fs');
const DateHandler = require('../../utilities/DateHandler');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

const confirmSassContent = fs.readFileSync(
  './shared/src/business/useCases/caseConfirmation/caseConfirmation.scss',
  'utf-8',
);
const confirmPugContent = fs.readFileSync(
  './shared/src/business/useCases/caseConfirmation/caseConfirmation.pug',
  'utf-8',
);
const ustcLogoBuffer = fs.readFileSync('./shared/static/images/ustc_seal.png');

const formattedCaseInfo = caseInfo => {
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
      servedDate: '(SERVED ON DATE)',
      todaysDate: DateHandler.formatNow('MONTH_DAY_YEAR'),
    },
    caseInfo.contactPrimary,
  );
  return formattedInfo;
};

/**
 * NOTE: to make this work, you must save the petition as a petitionsclerk
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
    raw: JSON.stringify(caseInfo, null, 4),
    logo: logoBase64,
  });
  return html;
};

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

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
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

    await page.setContent(await generateCaseConfirmationPage(caseToUpdate));

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

  const documentId = `case-${caseToUpdate.docketNumber}-confirmation.pdf`;

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
