import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export type ColdCaseEntry = {
  createdAt: string;
  preferredTrialCity: string;
  docketNumber: string;
  caseType: string;
  filingDate: string;
  eventCode: string;
  leadDocketNumber: string;
};

export const coldCaseReportInteractor = async (
  applicationContext: ServerApplicationContext,
): Promise<ColdCaseEntry[]> => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.COLD_CASE_REPORT)) {
    throw new UnauthorizedError(
      'Unauthorized for viewing the cold case report data',
    );
  }

  const coldCases = await applicationContext
    .getPersistenceGateway()
    .getColdCases({ applicationContext });

  return coldCases;
};
