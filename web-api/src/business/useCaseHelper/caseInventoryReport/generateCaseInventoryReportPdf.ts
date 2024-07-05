import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const generateCaseInventoryReportPdf = async ({
  applicationContext,
  authorizedUser,
  cases,
  filters,
}: {
  applicationContext: ServerApplicationContext;
  cases: RawCase[];
  filters: {
    associatedJudge?: string;
    status?: string;
  };
  authorizedUser: UnknownAuthUser;
}): Promise<{ fileId: string; url: string }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  applicationContext.logger.info('generateCaseInventoryReportPdf - start');

  const { setConsolidationFlagsForDisplay } = applicationContext.getUtilities();
  const formattedCases = cases
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
    .map(caseItem => setConsolidationFlagsForDisplay(caseItem, []))
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

  applicationContext.logger.info('generateCaseInventoryReportPdf - pdf built');

  const result = await applicationContext
    .getUseCaseHelpers()
    .saveFileAndGenerateUrl({
      applicationContext,
      file: caseInventoryReportPdf,
      useTempBucket: true,
    });

  applicationContext.logger.info('generateCaseInventoryReportPdf - pdf saved');

  return result;
};
