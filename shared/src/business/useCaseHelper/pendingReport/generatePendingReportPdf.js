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

  let formattedPendingItems = pendingItems.map(pendingItem => ({
    ...pendingItem,
    associatedJudgeFormatted: pendingItem.associatedJudge.replace(
      /^Judge\s+/,
      '',
    ),
    caseTitle: applicationContext.getCaseTitle(pendingItem.caseCaption || ''),
    formattedFiledDate: applicationContext
      .getUtilities()
      .formatDateString(pendingItem.receivedAt, 'MMDDYY'),
    formattedName: pendingItem.documentTitle || pendingItem.documentType,
  }));

  const contentHtml = await generatePendingReportPage({
    applicationContext,
    pendingItems: formattedPendingItems,
    reportTitle,
  });

  const documentId = await applicationContext
    .getUseCases()
    .generatePdfReportInteractor({
      applicationContext,
      contentHtml,
      documentIdPrefix: 'pending-report',
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
