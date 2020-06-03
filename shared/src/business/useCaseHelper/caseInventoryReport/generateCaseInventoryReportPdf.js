const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

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

  const caseInventoryReportPdf = await applicationContext
    .getDocumentGenerators()
    .caseInventoryReport({
      applicationContext,
      data: {
        formattedCases,
        reportTitle,
        showJudgeColumn,
        showStatusColumn,
      },
    });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: caseInventoryReportPdf,
  });
};
