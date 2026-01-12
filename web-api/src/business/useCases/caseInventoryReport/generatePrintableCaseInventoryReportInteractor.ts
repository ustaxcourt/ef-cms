import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseInventoryReport } from '@web-api/persistence/postgres/cases/reports/getCaseInventoryReport';

export const generatePrintableCaseInventoryReportInteractor = async (
  applicationContext: ServerApplicationContext,
  { associatedJudge, status }: { associatedJudge?: string; status?: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  if (!associatedJudge && !status) {
    throw new Error('Either judge or status must be provided');
  }

  applicationContext.logger.info(
    'generatePrintableCaseInventoryReportInteractor - authorized',
  );

  // Fetch all cases across all pages since we want to print a complete report
  const allCases: Omit<
    RawCase,
    | 'petitioners'
    | 'docketEntries'
    | 'hearings'
    | 'correspondence'
    | 'consolidatedCases'
  >[] = [];
  let page = 0;
  let hasMorePages = true;

  while (hasMorePages) {
    const { foundCases, totalCount } = await getCaseInventoryReport({
      associatedJudge,
      page,
      status,
    });

    allCases.push(...foundCases);
    page++;
    hasMorePages = allCases.length < totalCount;

    applicationContext.logger.debug(
      'generatePrintableCaseInventoryReportInteractor - fetched page',
      {
        page,
        casesThisPage: foundCases.length,
        totalFetched: allCases.length,
        totalCount,
      },
    );
  }

  applicationContext.logger.info(
    'generatePrintableCaseInventoryReportInteractor - fetched all cases',
    {
      foundCases: allCases.length,
      totalPages: page,
    },
  );

  const result = await applicationContext
    .getUseCaseHelpers()
    .generateCaseInventoryReportPdf({
      applicationContext,
      authorizedUser,
      cases: allCases,
      filters: { associatedJudge, status },
    });

  applicationContext.logger.info(
    'generatePrintableCaseInventoryReportInteractor - built pdf',
    {
      result,
    },
  );

  return result;
};
