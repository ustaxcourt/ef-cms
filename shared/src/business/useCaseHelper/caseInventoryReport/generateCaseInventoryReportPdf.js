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
  showJudgeColumn,
  showStatusColumn,
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
    showJudgeColumn,
    showStatusColumn,
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

  let formattedCases = cases
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
    .map(caseItem => ({
      ...caseItem,
      caseTitle: applicationContext.getCaseTitle(caseItem.caseCaption || ''),
    }));

  let reportTitle = '';
  let showJudgeColumn = true;
  let showStatusColumn = true;

  if (filters.status) {
    reportTitle = filters.status;
    showStatusColumn = false;
  }
  if (filters.status && filters.associatedJudge) {
    reportTitle += ' - ';
  }
  if (filters.associatedJudge) {
    reportTitle += filters.associatedJudge;
    showJudgeColumn = false;
  }

  const contentHtml = await generateCaseInventoryReportPage({
    applicationContext,
    formattedCases,
    reportTitle,
    showJudgeColumn,
    showStatusColumn,
  });

  const documentId = await applicationContext
    .getUseCases()
    .generatePdfReportInteractor({
      applicationContext,
      contentHtml,
      documentIdPrefix: 'case-inventory',
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
